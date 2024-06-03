import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { ingestionProviders } from './ingestion.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [IngestionController],
  providers: [IngestionService, ...ingestionProviders],
})
export class IngestionModule {}
