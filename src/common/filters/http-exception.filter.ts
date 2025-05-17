import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/error-response.dto';
// import { ValidationError } from 'class-validator';
// import { NotFoundResponseDto } from '../dto /notfound-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: ErrorResponseDto, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        // const request = ctx.getRequest<Request>();
        const isProduction = process.env.NODE_ENV === 'production';

        let status: number;
        const errorResponse = new ErrorResponseDto();

        // Handle HttpException (known errors)
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            // 4xx Client Errors status === Number(HttpStatus.BAD_REQUEST)
            if (status >= 400 && status < 500) {
                errorResponse.statusCode = status;
                errorResponse.message = (exceptionResponse as ErrorResponseDto).message || 'Client Error';
                errorResponse.errors = (exceptionResponse as ErrorResponseDto).errors;
                if (!isProduction) {
                    errorResponse.error = exception.error;
                    errorResponse.name = exception.name;
                }
            }
            // 5xx Server Errors
            else if (status >= 500) {
                errorResponse.statusCode = status;
                errorResponse.message = isProduction
                    ? 'Something went wrong'
                    : (exceptionResponse as ErrorResponseDto).message || 'Server Error';

                if (!isProduction) {
                    errorResponse.errors = (exceptionResponse as ErrorResponseDto).errors;
                    errorResponse.error = exception.error;
                    errorResponse.name = exception.name;
                    errorResponse.stack = exception.stack || 'No stack trace available';
                }
            }
        }
        // Handle unknown errors (treated as 500)
        else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            errorResponse.statusCode = status;
            errorResponse.message = 'Something went wrong';

            if (!isProduction) {
                errorResponse.error = exception.error;
                errorResponse.name = exception.name;
                errorResponse.errors = exception.errors || exception || 'No additional error information';
                errorResponse.stack = exception.stack || 'No stack trace available';
            }
        }

        response.status(status).json(errorResponse);
    }
}
