export const helmetOption = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'https://*.example.com'], // Allow images from example.com subdomains
            fontSrc: ["'self'", 'https://fonts.gstatic.com']
        }
    }
};

//   xssFilter: true,
//   noSniff: true,
//   ieNoOpen: true,
//   dnsPrefetchControl: { allow: true },
//   referrerPolicy: { policy: 'no-referrer' },
//   permittedCrossDomainPolicies: { permittedPolicies: 'none' },
//   hidePoweredBy: true,
//   hsts: { maxAge: 31536000, includeSubDomains: true },
//   crossOriginEmbedderPolicy: { policy: 'require-corp' as 'require-corp' },
//   crossOriginOpenerPolicy: { policy: 'same-origin' as 'same-origin' },
//   crossOriginResourcePolicy: { policy: 'same-origin' as 'same-origin' },
