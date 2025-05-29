// src/otp/dto/otp.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsJWT, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class OtpDto {
    @ApiProperty({
        example: '7416815171',
        description: 'Mobile number (primary & foreign key)'
    })
    @Length(10, 10, { message: 'Mobile Must Be 10 Digit' })
    @Matches(/^[6-9]{1}[0-9]{9}$/, {
        message: 'Mobile number must be Valid Indian Number'
    })
    @IsNotEmpty()
    // @MaxLength(10)
    // @MinLength(10)
    declare mobile: string;

    @ApiProperty({
        example: '1234',
        description: '4-digit OTP code'
    })
    @IsString()
    @IsNotEmpty()
    @Length(4, 4, { message: 'OTP code must be exactly 4 digits' })
    @Matches(/^[0-9]{4}$/, {
        message: 'OTP code must be Valid Number'
    })
    declare code: string;

    @ApiProperty({
        type: String,
        format: 'date-time',
        example: new Date().toISOString(),
        description: 'When this OTP expires'
    })
    @IsDate()
    @IsNotEmpty()
    declare expiresAt: Date;

    @ApiProperty({
        example: false,
        description: 'Whether this OTP has already been used'
    })
    declare isUsed: boolean;

    @ApiProperty({
        example: 'dfsfgsdgdfg.gn8PrprqjFoGK4qPT-yNNzv5q_1nYVi9QrzA91IEckE',
        description: 'refresh token'
    })
    @IsString()
    @IsNotEmpty()
    @IsJWT()
    declare refreshToken: string;

    @ApiProperty({
        example: 'dfgsdfgdfsg.gn8PrprqjFoGK4qPT-yNNzv5q_1nYVi9QrzA91IEckE',
        description: 'Access token'
    })
    @IsString()
    @IsNotEmpty()
    @IsJWT()
    declare accessToken: string;
}
