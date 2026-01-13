import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AbilityFactory } from 'src/auth/ability/ability.factory';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, AbilityFactory, DatabaseService],
})
export class TransactionsModule {}
