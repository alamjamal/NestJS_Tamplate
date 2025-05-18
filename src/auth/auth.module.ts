import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { OTP } from './model/auth.model';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/auth-guard/strategies/local.strategy';
import { JwtStrategy } from 'src/auth-guard/strategies/jwt.strategy';

@Module({
    imports: [
        SequelizeModule.forFeature([OTP]),
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const secret = config.get<string>('JWT_SECRET');
                if (!secret) {
                    throw new Error('JWT_SECRET environment variable is not set');
                }
                return {
                    secret,
                    signOptions: { expiresIn: '1h' }
                };
            }
        }),
        PassportModule,
        UserModule
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthModule]
})
export class AuthModule {}
