import { ApiProperty } from '@nestjs/swagger';
//this is dto class we have to use class-validator only to validate the data here
import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    Matches,
    MaxLength,
    MinLength
} from 'class-validator';
import { UserRole } from 'src/common/enums/UserRole';

export class UserDto {
    @ApiProperty({
        example: '237b395d-c73c-41c6-9d03-a93d778b0c2b',
        description: 'User ID',
        required: true
    })
    @IsUUID()
    id: string; // Required for updates

    @ApiProperty({ example: 'john_doe', description: 'Name' })
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @IsOptional()
    name: string;

    @ApiProperty({ example: 'john@example.com', description: 'Email' })
    @IsOptional()
    @IsEmail()
    email: string | null = null;

    @ApiProperty({ example: 'dfsgsdfg', description: 'Password' })
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: '7416815171', description: 'Mobile Number' })
    @Matches(/^[6-9]{1}[0-9]{9}$/, {
        message: 'Mobile number must be Valid Indian Number'
    })
    @IsNotEmpty()
    @MaxLength(10)
    @MinLength(10)
    mobile: string;

    //this should not expoose to end user
    @ApiProperty({ example: 'read', description: 'User Roles' })
    @IsEnum(UserRole)
    @IsNotEmpty()
    @Matches(/^(read|write|read_write)$/, {
        message: 'Role must be one of the following: read, write, read_write'
    })
    role: UserRole = UserRole.USER_READ; // Default role

    @ApiProperty({
        example: true,
        description: 'Verification status',
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isVerified?: boolean;

    @ApiProperty({
        example: true,
        description: 'Activation status',
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isActivate?: boolean;

    @ApiProperty({ example: false, description: 'Block status', required: false })
    @IsBoolean()
    @IsOptional()
    isBlocked?: boolean;

    @ApiProperty({
        example: '2023-10-01T12:00:00Z',
        description: 'Created At',
        required: false
    })
    @IsOptional()
    createdAt?: Date;
    @ApiProperty({
        example: '2023-10-01T12:00:00Z',
        description: 'Updated At',
        required: false
    })
    @IsOptional()
    updatedAt?: Date;
}
