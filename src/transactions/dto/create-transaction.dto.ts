import { IsDateString, IsEnum, IsInt, IsNumber } from 'class-validator';
import { TransactionType } from '../../shared/enums/transaction-type.enum';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsDateString()
  date: string;

  @IsInt()
  userId: number;

  @IsInt()
  categoryId: number;
}