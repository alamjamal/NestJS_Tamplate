// src/otp/dto/create-otp.dto.ts
import { PickType } from '@nestjs/swagger';
import { OtpDto } from './auth-otp.dto';

export class RefreshTokenDto extends PickType(OtpDto, ['refreshToken'] as const) {}
