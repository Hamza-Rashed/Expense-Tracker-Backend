import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { Action } from 'src/shared/enums/ability.types';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';

@UseGuards(JwtAuthGuard, AbilityGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create-new-category')
  @CheckAbility({ action: Action.Create, subject: 'Category' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @CheckAbility({ action: Action.List, subject: 'Category' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @CheckAbility({ action: Action.View, subject: 'Category' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Get('user/:userId')
  @CheckAbility({ action: Action.ListOwn, subject: 'Category' })
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.categoryService.findByUserId(userId);
  }

  @Patch(':id')
  @CheckAbility({ action: Action.Update, subject: 'Category' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @CheckAbility({ action: Action.Delete, subject: 'Category' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
