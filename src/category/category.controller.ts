import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { Action } from 'src/shared/enums/ability.types';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AbilityGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create-new-category')
  @ApiOperation({
    summary: 'Create a new category',
    description: `
Requires JWT authentication and **Create Category permission**.
This endpoint allows a user to create a new expense/income category.
    `,
  })
  @ApiBody({
    type: CreateCategoryDto,
    examples: {
      example: {
        value: {
          name: 'Food',
          userId: 1,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized (Missing or invalid JWT)' })
  @ApiResponse({ status: 403, description: 'Forbidden (Insufficient permissions)' })
  @CheckAbility({ action: Action.Create, subject: 'Category' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of all categories' })
  @CheckAbility({ action: Action.List, subject: 'Category' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @CheckAbility({ action: Action.View, subject: 'Category' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get categories for a specific user' })
  @ApiParam({ name: 'userId', type: Number, example: 1, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of categories for the user' })
  @CheckAbility({ action: Action.ListOwn, subject: 'Category' })
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.categoryService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Category ID' })
  @ApiBody({
    type: UpdateCategoryDto,
    examples: {
      example: {
        value: { name: 'Groceries' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @CheckAbility({ action: Action.Update, subject: 'Category' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @CheckAbility({ action: Action.Delete, subject: 'Category' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}