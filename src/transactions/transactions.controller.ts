import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { TransactionType } from 'src/shared/enums/transaction-type.enum';

@UseGuards(JwtAuthGuard, AbilityGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // CREATE
  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(dto);
  }

  // GET ALL
  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  // GET BY ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findOne(id);
  }

  // GET BY USER
  @Get('user/:userId')
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.transactionsService.findByUserId(userId);
  }

  // GET BY CATEGORY
  @Get('category/:categoryId')
  findByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.transactionsService.findByCategoryId(categoryId);
  }

  // GET BY DATE RANGE
  @Get('by-date/range')
  findByDateRange(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.transactionsService.findByDateRange(
      userId,
      new Date(start),
      new Date(end),
    );
  }

  // GET BY TYPE
  @Get('by-type')
  findByType(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('type') type: TransactionType,
  ) {
    return this.transactionsService.findByType(userId, type);
  }

  // GET MONTHLY SUMMARY
  @Get('summary/monthly')
  getMonthlySummary(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.transactionsService.getMonthlySummary(
      userId,
      new Date(start),
      new Date(end),
    );
  } 

  // UPDATE
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, dto);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.remove(id);
  }
}