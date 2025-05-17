import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';

export class FormatErrorPipe extends ValidationPipe {
    constructor() {
        super({
            whitelist: true,
            forbidNonWhitelisted: true,
            exceptionFactory: (errors: ValidationError[]) => {
                const formattedErrors = errors.reduce(
                    (acc, error) => {
                        acc[error.property] = Object.values(error.constraints || {});
                        return acc;
                    },
                    {} as Record<string, string[]>
                );

                return new BadRequestException({
                    statusCode: 400,
                    message: 'Validation failed',
                    errors: formattedErrors
                });
            }
        });
    }
}

//  app.useGlobalPipes(
//         new ValidationPipe({
//             whitelist: true,
//             forbidNonWhitelisted: true,
//             exceptionFactory: (errors) => {
//                 console.log(errors, 'errors');
//                 const formattedErrors = errors.reduce((acc, error) => {
//                     acc[error.property] = Object.values(error.constraints || {});
//                     return acc;
//                 }, {});
//                 return new BadRequestException({
//                     statusCode: 400,
//                     message: 'Validation failed',
//                     errors: formattedErrors
//                 });
//             }
//         })
//     );
