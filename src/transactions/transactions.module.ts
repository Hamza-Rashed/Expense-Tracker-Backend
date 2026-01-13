import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AbilityFactory } from 'src/auth/ability/ability.factory';
import { DatabaseService } from 'src/database/database.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TransactionsProducer } from './transactions.producer';

@Module({
  imports: [KafkaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, AbilityFactory, DatabaseService, TransactionsProducer],
})
export class TransactionsModule {}
