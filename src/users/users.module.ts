import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseService } from 'src/database/database.service';
import { AbilityFactory } from 'src/auth/ability/ability.factory';

@Module({
  controllers: [UsersController],
  providers: [UsersService, DatabaseService, AbilityFactory],
})
export class UsersModule {}
