import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { Errors } from 'src/errors/errors.factory';
import * as aragon2 from 'argon2';
import { userSafeSelect } from './dto/select-safe-user';

@Injectable()
export class UsersService {

  constructor(private readonly databaseService: DatabaseService) {}

  async createNewUser(createUserDto: CreateUserDto) {

  // Check if user with the same email already exists
  const existingUser = await this.databaseService.user.findUnique({
    where: { email: createUserDto.email },
  });

  if (existingUser) {
    throw Errors.DuplicateResource('User with this email already exists');
  }

  const hashedPassword = await aragon2.hash(createUserDto.password, { type: aragon2.argon2id });

  // Create the user with hashed password
  createUserDto.password = hashedPassword;
  await this.databaseService.user.create({
    data: createUserDto
  });

  return { message: `User ${createUserDto.fullName} created successfully` };
}

  async findAll() {
    return await this.databaseService.user.findMany({
      select: userSafeSelect,
    });
  }

  async findOne(id: number) {
    return await this.databaseService.user.findUnique({
      where: { id },
      select: userSafeSelect,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.databaseService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.databaseService.user.update({
      where: { id },
      data: { status: 'inactive' }, // Update user status to 'Inactive' => Soft delete
    });
  }
}
