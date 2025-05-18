// src/otp/dto/create-otp.dto.ts
import { PickType } from '@nestjs/swagger';
import { OtpDto } from './auth-otp.dto';

export class CreateOtpDto extends PickType(OtpDto, ['mobile'] as const) {}
