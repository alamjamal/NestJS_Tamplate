import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { LoggerService } from './common/services/logger.service';
import { ApplicationLogInterface } from './common/interface/application.log.interface';
import { CommonModule } from './common/common.module';
import { NodeEnv } from './common/enums/NodeEnv';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        {
            module: CommonModule,
            global: true
        },
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService, LoggerService],
            useFactory: (configService: ConfigService, loggingService: LoggerService<ApplicationLogInterface>) => {
                if (configService.get<NodeEnv>('NODE_ENV') == NodeEnv.Local) {
                    return {
                        dialect: 'sqlite',
                        storage: './database.sqlite', // Specify SQLite file path
                        synchronize: true,
                        autoLoadModels: true,
                        logging: (msg) => {
                            loggingService.setContext(SequelizeModule.name);
                            loggingService.log(msg);
                            // console.log(msg);
                        }
                    };
                } else {
                    return {
                        dialect: 'postgres',
                        host: configService.get<string>('DATABASE_HOST'),
                        port: configService.get<number>('DATABASE_PORT'),
                        username: configService.get<string>('DATABASE_USER'),
                        password: configService.get<string>('DATABASE_PASSWORD'),
                        database: configService.get<string>('DATABASE_NAME'),
                        autoLoadModels: true,
                        synchronize: false,
                        dialectOptions: {
                            ssl: {
                                require: true,
                                rejectUnauthorized: false
                            }
                        },
                        logging: (msg) => {
                            loggingService.setContext(SequelizeModule.name);
                            loggingService.log(msg);
                            // console.log(msg);
                        }
                    };
                }
                // models:[User]
            }
        }),
        UserModule,
        AuthModule,
        CommonModule
    ],

    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
