import { ApiProperty } from '@nestjs/swagger';

export class NotFoundResponseDto {
    @ApiProperty({
        type: 'number',
        example: 404,
        description: 'HTTP status code'
    })
    statusCode: number;

    @ApiProperty({
        type: 'string',
        example: 'Not Found',
        description: 'HTTP status message'
    })
    message: string;
}
