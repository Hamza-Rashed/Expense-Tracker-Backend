import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AbilityFactory } from 'src/auth/ability/ability.factory';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, AbilityFactory, DatabaseService],
})
export class CategoryModule {}
