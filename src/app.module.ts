import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BudgetsModule } from './budgets/budgets.module';
import RootConfigurations from './forRoot.config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({ // Rate Limiting Module: Protect the APIs using rate limiting
      throttlers: [
        {
          ttl: 60000, // 1 minute
          limit: 20, // 20 requests per minute
        }, 
      ],
    }),
    ConfigModule.forRoot(RootConfigurations),
    DatabaseModule,
    KafkaModule,
    AuthModule,
    UsersModule,
    CategoryModule,
    TransactionsModule,
    BudgetsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
