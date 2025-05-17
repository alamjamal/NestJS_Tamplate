// src/user/dto/user-id.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UserIdDto {
    @ApiProperty({
        example: '237b395d-c73c-41c6-9d03-a93d778b0c2b',
        description: 'User ID'
    })
    @IsUUID(4, { message: 'ID must be a valid UUID v4' })
    id: string;
}
