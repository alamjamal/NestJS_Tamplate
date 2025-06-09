const allowedOrigins = [
    'https://www.instaxerox.in',
    'https://instaxerox.in',
    'https://test.instaxerox.in',
    'https://dev.instaxerox.in',
    'https://stage.instaxerox.in',
    'https://prod.instaxerox.in',
    'https://app.instaxerox.in',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://192.168.1.14:3000/',
    'http://192.168.1.3:3000/',
    'http://192.168.0.2:3000/'
];

export const corsOptions = {
    origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Important for CSRF + Cookies
    optionSuccessStatus: 200,
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization,x-access-token, x-csrf-token',
    methods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS,PATCH'
    // exposedHeaders: 'Content-Disposition',
};
