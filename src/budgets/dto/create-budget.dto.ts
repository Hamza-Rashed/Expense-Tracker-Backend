import { IsInt, IsNumber } from 'class-validator';

export class CreateBudgetDto {
  @IsNumber()
  amount: number;

  @IsInt()
  categoryId: number;
}