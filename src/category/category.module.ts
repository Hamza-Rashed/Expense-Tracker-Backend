import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AbilityFactory } from 'src/auth/ability/ability.factory';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, AbilityFactory],
})
export class CategoryModule {}
