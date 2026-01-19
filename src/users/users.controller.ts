import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { Action } from 'src/shared/enums/ability.types';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth() // Swagger Bearer Authentication
@UseGuards(JwtAuthGuard, AbilityGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-new-user')
    @ApiOperation({
    summary: 'Create a new user',
    description: `
      Requires **JWT authentication** and **Create User permission**.
      This endpoint creates a new user in the system.
    `,
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example: {
        value: {
          fullName: 'John Doe',
          email: 'john.doe@email.com',
          password: 'StrongPassword123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (Missing or invalid JWT)',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (Insufficient permissions)',
  })
  @CheckAbility({ action: Action.Create, subject: 'User' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createNewUser(createUserDto);
  }

  @Get()
    @ApiOperation({
    summary: 'Get all users',
    description: `
      Returns a list of all users.
      Requires **List User permission**.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'List of users',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @CheckAbility({ action: Action.List, subject: 'User' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
    @ApiOperation({
    summary: 'Get user by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'User ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @CheckAbility({ action: Action.View, subject: 'User' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update user information',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @CheckAbility({ action: Action.Update, subject: 'User' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
    @ApiOperation({
    summary: 'Delete user',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @CheckAbility({ action: Action.Delete, subject: 'User' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
