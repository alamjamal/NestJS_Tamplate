import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle('NestJS API')
        .setDescription('The NestJS API description')
        .setExternalDoc('Postman Collection', '/docs-json')
        .setVersion('1.0')
        .addBearerAuth()
        // .addTag('users', 'Users related endpoints')
        // .addTag('auth', 'Authentication related endpoints')
        // .addTag('products', 'Products related endpoints')
        // .addTag('orders', 'Orders related endpoints')
        // .addTag('categories', 'Categories related endpoints')
        // .addTag('carts', 'Carts related endpoints')
        // .addTag('addresses', 'Addresses related endpoints')
        // .addTag('payments', 'Payments related endpoints')
        // .addTag('coupons', 'Coupons related endpoints')
        // .addTag('notifications', 'Notifications related endpoints')
        // .addTag('reviews', 'Reviews related endpoints')
        // .addTag('wishlists', 'Wishlists related endpoints')
        // .addTag('settings', 'Settings related endpoints')
        // .addTag('analytics', 'Analytics related endpoints')
        // .addTag('reports', 'Reports related endpoints')
        // .addTag('feedbacks', 'Feedbacks related endpoints')
        // .addTag('subscriptions', 'Subscriptions related endpoints')
        // .addTag('promotions', 'Promotions related endpoints')
        // .addTag('transactions', 'Transactions related endpoints')
        // .addTag('shipping', 'Shipping related endpoints')
        // .addTag('returns', 'Returns related endpoints')
        // .addTag('wishlists', 'Wishlists related endpoints')
        // .addTag('coupons', 'Coupons related endpoints')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true
            // docExpansion: 'none',
            // defaultModelsExpandDepth: -1,
            // filter: true,
            // showExtensions: true,
            // showCommonExtensions: true,
            // tagsSorter: 'alpha',
            // operationsSorter: 'alpha',
            // displayOperationId: true,
        }
    });
}
