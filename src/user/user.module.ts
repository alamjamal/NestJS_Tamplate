import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthGuardModule } from 'src/auth-guard/auth-guard.module';

@Module({
    imports: [SequelizeModule.forFeature([User]), AuthGuardModule],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
