
//no need to seperate the config file for each environment because we are using the same database for all environments
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    dialect: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    schema: process.env.DATABASE_SCHEMA,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    autoLoadModels: true,
    synchronize: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}
