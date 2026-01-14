import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaTransactionPayload } from 'src/interfaces/kafka.transaction.interface';
import { KAFKA_SERVICE } from 'src/kafka/kafka.constants';

@Injectable()
export class TransactionsProducer {
  constructor(
    @Inject(KAFKA_SERVICE)
    private readonly kafkaClient: ClientKafka,
  ) {}

  emitTransactionCreated(payload: KafkaTransactionPayload) {
    this.kafkaClient.emit('transaction.created', payload);
  }
}