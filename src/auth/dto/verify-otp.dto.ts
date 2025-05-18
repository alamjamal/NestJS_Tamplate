// src/otp/dto/create-otp.dto.ts
import { PickType } from '@nestjs/swagger';
import { OtpDto } from './auth-otp.dto';

export class VerifyOtpDto extends PickType(OtpDto, ['mobile', 'code'] as const) {}
