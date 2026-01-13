import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AbilityFactory } from 'src/auth/ability/ability.factory';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, AbilityFactory],
})
export class TransactionsModule {}
