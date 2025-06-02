import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { OTP } from './model/auth.model';
import { CreateOtpDto } from './dto/create-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UserService } from '../user/user.service';
import { UserDto } from 'src/user/dto/user-dto';
import { randomInt, randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { PayloadType } from 'src/common/type/Payload';
import { OtpDto } from './dto/auth-otp.dto';
// import { generateString } from 'src/common/fn/generateString';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(OTP) private otpModel: typeof OTP,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private config: ConfigService
    ) {}

    private async verifyRefreshToken(token: string): Promise<PayloadType> {
        try {
            const payload: PayloadType = await this.jwtService.verifyAsync(token, {
                secret: this.config.get<string>('JWT_REFRESH_SECRET')
            });
            return payload;
        } catch {
            // Handle token verification error
            throw new BadRequestException('Invalid token');
        }
    }
    private generateTokens(user: UserDto, loginWith: string, uid: string) {
        const payload: PayloadType = {
            sub: user.id,
            mobile: user.mobile,
            role: user.role,
            loginWith,
            uid
        };

        // 1) access token
        const accessToken = this.jwtService.sign(payload as object, {
            secret: this.config.get<string>('JWT_SECRET'),
            expiresIn: '1h' // or whatever you like
        });

        // 2) refresh token
        const refreshToken = this.jwtService.sign(payload as object, {
            secret: this.config.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d' // typically longer
        });

        // 3) OPTIONAL: store a hash of the refresh token so you can revoke it later
        // await this.userService.setCurrentRefreshToken(refreshToken, user.id);

        return { accessToken, refreshToken };
    }

    async requestOtp(dto: CreateOtpDto): Promise<OtpDto> {
        const record = await this.otpModel.findOne({ where: { mobile: dto.mobile } });
        if (record) {
            if (record.expiresAt.getTime() > Date.now()) {
                const remainingTime = record.expiresAt.getTime() - Date.now();
                const remainingMinutes = Math.floor(remainingTime / (1000 * 60)).toString();
                const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000).toString();
                // OTP expired, allow sending a new one
                throw new BadRequestException(
                    `OTP already sent, please wait for ${remainingMinutes}::${remainingSeconds} minutes`
                );
            }
        }
        // const code = Math.floor(1000 + Math.random() * 9000).toString();
        const code = randomInt(1000, 10000).toString(); // crypto-secure, still very fast

        // Set expiry date for OTP
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 min expiry

        // upsert an OTP record (new or overwrite previous)
        await this.otpModel.upsert({
            mobile: dto.mobile,
            code,
            expiresAt,
            isUsed: false
        });

        // TODO: integrate with SMS gateway to send `code` to `dto.mobile`
        return { code: code, expiresAt: expiresAt } as OtpDto;
    }

    async validateOtp(dto: VerifyOtpDto): Promise<UserDto> {
        const record = await this.otpModel.findOne({ where: { mobile: dto.mobile, code: dto.code } });
        if (!record) {
            throw new BadRequestException('Invalid OTP');
        }

        // 2) check expiry & usage
        if (record.isUsed) {
            throw new BadRequestException('OTP already used');
        }
        if (record.expiresAt.getTime() < Date.now()) {
            await this.otpModel.destroy({ where: { mobile: dto.mobile, code: dto.code } });
            throw new BadRequestException('OTP expired');
        }

        // 3) mark used
        record.isUsed = true;
        await record.save();

        // 4) find or create user
        let user: Partial<UserDto> = await this.userService.findByMobile(dto.mobile);
        if (!user) {
            user = await this.userService.create({ mobile: dto.mobile, isActivate: true });
        }

        return user as UserDto;
    }
    verifyOtp(user: UserDto) {
        // 1) find OTP record

        // 5) issue JWT
        // const payload: PayloadType = { sub: user.id, mobile: user.mobile, role: user.role };
        // const token = this.jwtService.sign(payload);
        const passCode = randomBytes(16).toString('hex');

        const { accessToken, refreshToken } = this.generateTokens(user, 'otp', user.id);
        return { accessToken, refreshToken, passCode };
    }

    async generateAccessToken(RefToken: string) {
        const payload = await this.verifyRefreshToken(RefToken);
        const user: CreateOtpDto = await this.userService.findOne(payload.sub);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        // const newPayload: PayloadType = { sub: user.id, mobile: user.mobile, role: user.role };
        const { accessToken, refreshToken } = this.generateTokens(user as UserDto, payload.loginWith, payload.uid);
        return { accessToken, refreshToken };
    }

    async logout(token: string) {
        const payload = await this.verifyRefreshToken(token);
        const user = await this.userService.findOne(payload.sub);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        // await this.otpService.blackListToken(user.id);
        return { message: 'Logged out successfully' };
    }
}
