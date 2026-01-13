import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TransactionType } from '@prisma/client';
import { Errors } from 'src/errors/errors.factory';

@Injectable()
export class BudgetsService {
  constructor(private readonly database: DatabaseService) {}

  // Create or Update Budget (Upsert)
  async setBudget(categoryId: number, amount: number) {
    return this.database.budget.upsert({
      where: { categoryId },
      update: { amount },
      create: {
        categoryId,
        amount,
      },
    });
  }

  // Get Budget with current spending
  async getBudgetStatus(categoryId: number) {
    const budget = await this.database.budget.findUnique({
      where: { categoryId },
      include: {
        category: true,
      },
    });

    if (!budget) {
      throw Errors.NotFound('Budget', categoryId.toString());
    }

    const spent = await this.database.transaction.aggregate({
      where: {
        categoryId,
        type: TransactionType.expense,
      },
      _sum: {
        amount: true,
      },
    });

    const totalSpent = spent._sum.amount ?? 0;
    const remaining = budget.amount - totalSpent;
    const percentageUsed = (totalSpent / budget.amount) * 100;

    return {
      category: budget.category.name,
      budget: budget.amount,
      spent: totalSpent,
      remaining,
      percentageUsed,
      isExceeded: totalSpent > budget.amount,
    };
  }

  // Check budget usage (used by Kafka consumer)
  async checkBudgetLimit(categoryId: number) {
    const status = await this.getBudgetStatus(categoryId);

    if (status.isExceeded) {
      console.warn(
        `Budget exceeded for category ${status.category}: ${status.spent}/${status.budget}`,
      );
    }

    return status;
  }

  // Get all budgets for a user (dashboard)
  async getUserBudgets(userId: number) {
    const budgets = await this.database.budget.findMany({
      where: {
        category: {
          userId,
        },
      },
      include: {
        category: true,
      },
    });

    return Promise.all(
      budgets.map(async (budget) => {
        const spent = await this.database.transaction.aggregate({
          where: {
            categoryId: budget.categoryId,
            type: TransactionType.expense,
          },
          _sum: {
            amount: true,
          },
        });

        const totalSpent = spent._sum.amount ?? 0;

        return {
          category: budget.category.name,
          budget: budget.amount,
          spent: totalSpent,
          remaining: budget.amount - totalSpent,
          exceeded: totalSpent > budget.amount,
        };
      }),
    );
  }
}