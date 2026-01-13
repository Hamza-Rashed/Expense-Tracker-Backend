import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BudgetsService } from './budgets.service';

@Controller()
export class BudgetsConsumer {
  constructor(private readonly budgetsService: BudgetsService) {}

  @EventPattern('transaction.created')
  async onTransactionCreated(
    @Payload()
    data: {
      categoryId: number;
      type: string;
    },
  ) {
    if (data.type === 'expense') {
      await this.budgetsService.checkBudgetLimit(data.categoryId);
    }
  }
}