import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User // Inject the User model
    ) {}
    async create(createUserDto: Partial<CreateUserDto>): Promise<CreateUserDto> {
        const user = await this.userModel.findOne<User>({
            where: {
                [Op.or]: [
                    // Use Sequelize's Op.or operator
                    { email: createUserDto.email ?? '' },
                    { mobile: createUserDto.mobile }
                ]
            }
        });
        if (user) {
            throw new NotAcceptableException('User already exists');
        }
        return await this.userModel.create<User>({ ...createUserDto });
    }

    async findAll(): Promise<CreateUserDto[]> {
        const result = await this.userModel.findAll<User>({});
        return result;
    }

    async findOne(id: string): Promise<CreateUserDto> {
        // const user = await this.userModel.findByPk<User>(id);
        const user = await this.userModel.findOne<User>({
            where: { id: id }
        });
        // if (!user) {
        //   throw new NotFoundException(`User with ID ${id} not found`);
        // }

        return user as CreateUserDto;
    }

    async findByMobile(mobile: string): Promise<UserDto> {
        // const user = await this.userModel.findByPk<User>(id);
        const user = await this.userModel.findOne<User>({
            where: { mobile: mobile }
        });
        // if (!user) {
        //     return null;
        // }

        return user as UserDto;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<number> {
        const [affectedCount] = await this.userModel.update<User>(updateUserDto, {
            where: { id: id }
        });
        return affectedCount;
    }

    remove(id: string): Promise<number> {
        return this.userModel.destroy({
            where: { id: id }
        });
    }
}
