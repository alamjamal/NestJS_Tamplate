const allowedOriginsForProd = [
    'https://www.braindost.tech',
    'https://braindost.tech',
    'https://test.braindost.tech',
    'https://dev.braindost.tech',
    'https://stage.braindost.tech',
    'https://prod.braindost.tech',
    'https://app.braindost.tech',
    'http://localhost:4173'
];
const allowedOriginsForDev = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://192.168.1.14:3000/',
    'http://192.168.1.3:3000/',
    'http://192.168.0.2:3000/'
];
const allowedOrigins = process.env.NODE_ENV === 'production' ? allowedOriginsForProd : allowedOriginsForDev;
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
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization,x-access-token, x-csrf-token'
    // methods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS,PATCH'
    // exposedHeaders: 'Content-Disposition',
};
