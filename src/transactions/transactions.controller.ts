import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
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

import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { Action } from 'src/shared/enums/ability.types';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';
import { TransactionType } from 'src/shared/enums/transaction-type.enum';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AbilityGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new transaction',
    description: 'Emits a Kafka event "transaction.created" after creation',
  })
  @ApiBody({
    type: CreateTransactionDto,
    examples: {
      example: {
        value: {
          amount: 50.0,
          type: 'expense',
          date: '2026-01-13T15:30:00Z',
          userId: 1,
          categoryId: 2,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized (Missing/invalid JWT)' })
  @ApiResponse({ status: 403, description: 'Forbidden (Insufficient permissions)' })
  @CheckAbility({ action: Action.Create, subject: 'Transaction' })
  create(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, description: 'List of all transactions' })
  @CheckAbility({ action: Action.List, subject: 'Transaction' })
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Transaction found' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @CheckAbility({ action: Action.View, subject: 'Transaction' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get transactions by user ID' })
  @ApiParam({ name: 'userId', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'List of user transactions' })
  @CheckAbility({ action: Action.ListOwn, subject: 'Transaction' })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.transactionsService.findByUserId(userId);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get transactions by category ID' })
  @ApiParam({ name: 'categoryId', type: Number, example: 2 })
  @ApiResponse({ status: 200, description: 'List of transactions for this category' })
  @CheckAbility({ action: Action.ListOwn, subject: 'Transaction' })
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.transactionsService.findByCategoryId(categoryId);
  }

  @Get('by-date/range')
  @ApiOperation({ summary: 'Get transactions by date range for a user' })
  @ApiQuery({ name: 'userId', type: Number, example: 1 })
  @ApiQuery({ name: 'start', type: String, example: '2026-01-01' })
  @ApiQuery({ name: 'end', type: String, example: '2026-01-31' })
  @ApiResponse({ status: 200, description: 'List of transactions in the date range' })
  @CheckAbility({ action: Action.ListOwn, subject: 'Transaction' })
  findByDateRange(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.transactionsService.findByDateRange(userId, new Date(start), new Date(end));
  }

  @Get('by-type')
  @ApiOperation({ summary: 'Get transactions by type (income/expense) for a user' })
  @ApiQuery({ name: 'userId', type: Number, example: 1 })
  @ApiQuery({ name: 'type', enum: TransactionType, example: 'expense' })
  @ApiResponse({ status: 200, description: 'List of transactions filtered by type' })
  @CheckAbility({ action: Action.ListOwn, subject: 'Transaction' })
  findByType(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('type') type: TransactionType,
  ) {
    return this.transactionsService.findByType(userId, type);
  }

  @Get('summary/monthly')
  @ApiOperation({ summary: 'Get monthly summary of transactions for a user' })
  @ApiQuery({ name: 'userId', type: Number, example: 1 })
  @ApiQuery({ name: 'start', type: String, example: '2026-01-01' })
  @ApiQuery({ name: 'end', type: String, example: '2026-01-31' })
  @ApiResponse({
    status: 200,
    description: 'Summary including total income, expenses, and net balance',
    schema: {
      example: {
        totalIncome: 500,
        totalExpense: 300,
        net: 200,
      },
    },
  })
  @CheckAbility({ action: Action.ListOwn, subject: 'Transaction' })
  getMonthlySummary(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.transactionsService.getMonthlySummary(userId, new Date(start), new Date(end));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({ status: 200, description: 'Transaction updated successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @CheckAbility({ action: Action.Update, subject: 'Transaction' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTransactionDto) {
    return this.transactionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Transaction deleted successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @CheckAbility({ action: Action.Delete, subject: 'Transaction' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.remove(id);
  }
}
