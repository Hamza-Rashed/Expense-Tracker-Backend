import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';
import { Action } from 'src/shared/enums/ability.types';

@ApiTags('Budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AbilityGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post('set')
  @ApiOperation({
    summary: 'Create or update a budget for a category',
    description: `
      Upserts a budget for a given category.
      Requires JWT authentication and Create/Update permissions.
      Emits Kafka events for monitoring if budget is exceeded (optional).`,
  })
  @ApiBody({
    schema: {
      example: { categoryId: 1, amount: 500 },
    },
  })
  @ApiResponse({ status: 201, description: 'Budget created/updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @CheckAbility({ action: Action.Create, subject: 'Budget' })
  async setBudget(@Body() body: { categoryId: number; amount: number }) {
    return this.budgetsService.setBudget(body.categoryId, body.amount);
  }

  @Get('status/:categoryId')
  @ApiOperation({
    summary: 'Get budget status for a category',
    description:
      'Returns current spending, remaining budget, % used, and whether the budget is exceeded',
  })
  @ApiParam({ name: 'categoryId', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Budget status for the category',
    schema: {
      example: {
        category: 'Food',
        budget: 500,
        spent: 200,
        remaining: 300,
        percentageUsed: 40,
        isExceeded: false,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Budget not found' })
  @CheckAbility({ action: Action.View, subject: 'Budget' })
  async getBudgetStatus(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.budgetsService.getBudgetStatus(categoryId);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get all budgets for a user',
    description:
      'Returns all budgets for the user with current spending, remaining amount, and exceeded flag',
  })
  @ApiParam({ name: 'userId', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'List of budgets for the user',
    schema: {
      example: [
        {
          category: 'Food',
          budget: 500,
          spent: 200,
          remaining: 300,
          exceeded: false,
        },
        {
          category: 'Transport',
          budget: 300,
          spent: 350,
          remaining: -50,
          exceeded: true,
        },
      ],
    },
  })
  @CheckAbility({ action: Action.ListOwn, subject: 'Budget' })
  async getUserBudgets(@Param('userId', ParseIntPipe) userId: number) {
    return this.budgetsService.getUserBudgets(userId);
  }
}
