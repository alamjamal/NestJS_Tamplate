import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1h' }
            })
        })
    ],
    providers: [JwtAuthGuard],
    exports: [JwtModule]
})
export class AuthGuardModule {}
