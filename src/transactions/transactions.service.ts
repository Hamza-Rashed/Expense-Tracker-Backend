import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DatabaseService } from 'src/database/database.service';
import { Errors } from 'src/errors/errors.factory';
import { TransactionType } from 'src/shared/enums/transaction-type.enum';

@Injectable()
export class TransactionsService {
  constructor( private databaseService: DatabaseService) {}

    async create(createTransactionDto: CreateTransactionDto) {
  
      // Check if the user exists
      const userExists = await this.databaseService.user.findUnique({
        where: { id: createTransactionDto.userId },
      });
  
      if (!userExists) {
        throw Errors.NotFound('User', createTransactionDto.userId.toString());
      }
  
      await this.databaseService.transaction.create({
        data: createTransactionDto,
      });

      return `Transaction has been created successfully for user ID ${createTransactionDto.userId}`;
    }
  
    async findAll() {
      return await this.databaseService.transaction.findMany();
    }
  
    async findOne(id: number) {
      return await this.databaseService.transaction.findUnique({
        where: { id },
      });
    }

    async findByCategoryId(categoryId: number) {
      return await this.databaseService.transaction.findMany({
        where: { categoryId },
      });
    }

    async findByDateRange(userId: number, startDate: Date, endDate: Date) {
      return await this.databaseService.transaction.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
    }

    async findByType(userId: number, type: TransactionType) {
      return this.databaseService.transaction.findMany({
        where: {
          userId,
          type,
        },
      });
    }

    async getMonthlySummary(userId: number, start: Date, end: Date) {
      return this.databaseService.transaction.groupBy({
        by: ['type'],
        where: {
          userId,
          date: {
            gte: start,
            lte: end,
          },
        },
        _sum: {
          amount: true,
        },
      });
    }

    // Get all user transactions
    async findByUserId(userId: number) {
      return await this.databaseService.transaction.findMany({
        where: { userId },
      });
    }
  
    async update(id: number, updateTransactionDto: UpdateTransactionDto) {
      return await this.databaseService.transaction.update({
        where: { id },
        data: updateTransactionDto,
      });
    }
  
    async remove(id: number) {
      return await this.databaseService.transaction.delete({
        where: { id },
      });
    }
}
