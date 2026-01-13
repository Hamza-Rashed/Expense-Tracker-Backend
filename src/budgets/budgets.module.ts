import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { DatabaseService } from 'src/database/database.service';
import { BudgetsConsumer } from './budgets.consumer';
import { AbilityFactory } from 'src/auth/ability/ability.factory';

@Module({
  controllers: [BudgetsController, BudgetsConsumer],
  providers: [BudgetsService, DatabaseService, AbilityFactory],
})
export class BudgetsModule {}
