import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from 'src/database/database.service';
import { Errors } from 'src/errors/errors.factory';


@Injectable()
export class CategoryService {

  constructor( private databaseService: DatabaseService) {}
  async create(createCategoryDto: CreateCategoryDto) {

    // Check if the user exists
    const userExists = await this.databaseService.user.findUnique({
      where: { id: createCategoryDto.userId },
    });

    if (!userExists) {
      throw Errors.NotFound('User', createCategoryDto.userId.toString());
    }

    await this.databaseService.category.create({
      data: {
        name: createCategoryDto.name,
        userId: createCategoryDto.userId,
      },
    });

    return `Category ${createCategoryDto.name} created successfully for user ID ${createCategoryDto.userId}`;
  }

  async findAll() {
    return await this.databaseService.category.findMany();
  }

  async findOne(id: number) {
    return await this.databaseService.category.findUnique({
      where: { id },
    });
  }

  // Get all user categories
  async findByUserId(userId: number) {
    return await this.databaseService.category.findMany({
      where: { userId },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return await this.databaseService.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    return await this.databaseService.category.delete({
      where: { id },
    });
  }
}
