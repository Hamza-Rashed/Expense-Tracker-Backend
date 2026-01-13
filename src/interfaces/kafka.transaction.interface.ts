export interface KafkaTransactionPayload {
  transactionId: number;
  userId: number;
  categoryId: number;
  amount: number;
  type: string;
  date: Date;
}
