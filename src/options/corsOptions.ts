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
    'http://localhost:3002'
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
