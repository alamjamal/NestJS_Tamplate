import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiNotAcceptableResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags
} from '@nestjs/swagger';
import { UserIdDto } from 'src/common/dto/user-id.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { NotFoundResponseDto } from 'src/common/dto/notfound-response.dto';
import { UserDto } from './dto/user-dto';
import { JwtAuthGuard } from 'src/auth-guard/guards/auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('User')
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('User')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/add-user')
    @ApiOperation({ summary: 'Add a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiOkResponse({ type: UserDto })
    @ApiBadRequestResponse({ description: 'Forbidden', type: ErrorResponseDto })
    @ApiNotAcceptableResponse({
        description: 'Forbidden',
        type: ErrorResponseDto
    })
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiOkResponse({ type: [CreateUserDto] })
    @ApiBadRequestResponse({ description: 'Forbidden', type: ErrorResponseDto })
    @ApiNotFoundResponse({ description: 'No content', type: NotFoundResponseDto })
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiOkResponse({ type: CreateUserDto })
    @ApiBadRequestResponse({ description: 'Forbidden', type: ErrorResponseDto })
    @ApiNotFoundResponse({ description: 'No content', type: NotFoundResponseDto })
    findOne(@Param() params: UserIdDto) {
        return this.userService.findOne(params.id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a user by ID' })
    @ApiBody({ type: UpdateUserDto })
    @ApiOkResponse({ type: UpdateUserDto })
    @ApiBadRequestResponse({ description: 'Forbidden', type: ErrorResponseDto })
    @ApiNotFoundResponse({ description: 'No content', type: NotFoundResponseDto })
    update(@Param() params: UserIdDto, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(params.id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiOkResponse({ description: 'User deleted successfully' })
    @ApiBadRequestResponse({ description: 'Forbidden', type: ErrorResponseDto })
    @ApiNotFoundResponse({ description: 'No content', type: NotFoundResponseDto })
    remove(@Param() params: UserIdDto) {
        return this.userService.remove(params.id);
    }
}
