import { Body, Controller, Post, UseGuards, Get, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateOtpDto } from './dto/create-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequestType } from 'src/common/type/Request';
import { Request as ExpressRequest } from 'express';
import { UserDto } from 'src/user/dto/user-dto';
import { JwtAuthGuard } from 'src/auth-guard/guards/auth.guard';
// import { PassportJwtGuard } from 'src/auth-guard/guards/jwt.guard';
import { OtpDto } from './dto/auth-otp.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/user/request-otp')
    @ApiOperation({ summary: 'Send OTP' })
    @ApiBody({ type: CreateOtpDto })
    @ApiOkResponse({})
    @ApiCreatedResponse({})
    @ApiBadRequestResponse({ description: 'Forbidden', type: ErrorResponseDto })
    requestOtp(@Body() type: CreateOtpDto): Promise<OtpDto> {
        return this.authService.requestOtp(type);
    }

    @Post('/user/verify-otp')
    @ApiOperation({ summary: 'Send OTP' })
    @ApiBody({ type: VerifyOtpDto })
    @ApiOkResponse({})
    @ApiCreatedResponse({})
    @ApiBadRequestResponse({ description: 'Forbidden', type: ErrorResponseDto })
    async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
        const user: UserDto = await this.authService.validateOtp(dto);
        const token = this.authService.verifyOtp(user);
        res.cookie('accessToken', token.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        });
        res.cookie('refreshToken', token.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });

        return { passCode: token.passCode, user };
    }

    @Post('/user/access-token')
    @ApiOperation({ summary: 'Get Access Token' })
    @ApiBody({ type: RefreshTokenDto })
    @ApiOkResponse({})
    @ApiCreatedResponse({})
    @ApiBadRequestResponse({ description: 'Forbidden', type: ErrorResponseDto })
    getAccessToken(@Body() dto: RefreshTokenDto) {
        return this.authService.generateAccessToken(dto.refreshToken);
    }

    @Post('/user/logout')
    @ApiOperation({ summary: 'Log Out ' })
    @ApiBody({ type: RefreshTokenDto })
    @ApiOkResponse({})
    @ApiCreatedResponse({})
    @ApiBadRequestResponse({ description: 'Forbidden', type: ErrorResponseDto })
    logOut(@Body() dto: RefreshTokenDto) {
        return this.authService.logout(dto.refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    // @UseGuards(PassportJwtGuard)
    @ApiBearerAuth()
    @Get('/me')
    getCurrentUser(@Request() request: ExpressRequest) {
        return request.user as RequestType;
    }
}
