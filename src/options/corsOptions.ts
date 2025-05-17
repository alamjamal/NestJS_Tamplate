export const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
    // credentials: true,
    // allowedHeaders: 'Content-Type, Accept',
    // exposedHeaders: 'Content-Disposition',
};
