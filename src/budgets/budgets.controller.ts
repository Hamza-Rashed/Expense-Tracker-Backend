import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  // Create / Update Budget
  @Post(':categoryId')
  setBudget(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body('amount') amount: number,
  ) {
    return this.budgetsService.setBudget(categoryId, amount);
  }

  // Get Budget Status (spent vs limit)
  @Get('category/:categoryId')
  getBudgetStatus(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.budgetsService.getBudgetStatus(categoryId);
  }

  // Get all budgets for user (dashboard)
  @Get('user/:userId')
  getUserBudgets(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.budgetsService.getUserBudgets(userId);
  }
}