import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [DatabaseService, ConfigService],
})
export class DatabaseModule {}
