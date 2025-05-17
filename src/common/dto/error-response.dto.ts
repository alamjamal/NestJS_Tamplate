import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({
        type: 'number',
        example: 400,
        description: 'HTTP status code'
    })
    statusCode: number;

    @ApiProperty({
        type: 'string',
        example: 'Some API error',
        description: 'API error message'
    })
    message: string;

    @ApiProperty({
        type: 'string',
        example: 'Error Message',
        description: 'Detailed Error Message'
    })
    error: string;

    @ApiProperty({
        type: 'string',
        example: 'Error Name',
        description: 'Detailed Error Name'
    })
    name: string;

    @ApiProperty({
        type: 'string',
        example: 'Custom error Object',
        description: 'Custom Error Object'
    })
    errors: object;

    @ApiProperty({
        type: 'string',
        example: 'Detailed stack trace',
        description: 'Detailed stack trace'
    })
    stack: string;
}
