import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as csv from 'fast-csv';
import { Ingestion } from './entities/ingestion.entity';
import { Readable } from 'stream';
import { Logger } from '@nestjs/common';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    @Inject('INGESTION_MODEL')
    private ingestionModel: mongoose.Model<Ingestion>,
  ) {}

  async create(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileStream = new Readable();
      fileStream.push(file.buffer);
      fileStream.push(null);

      const batchSize = 1000;
      let batch = [];
      const insertPromises = [];

      fileStream
        .pipe(csv.parse({ headers: true }))
        .on('data', (row) => {
          batch.push(row);
          if (batch.length >= batchSize) {
            const currentBatch = batch;
            batch = [];
            insertPromises.push(this.insertBatch(currentBatch));
          }
        })
        .on('error', (error) => {
          this.logger.error(`Erro ao processar o CSV: ${error.message}`);
          reject(new BadRequestException(`Erro ao processar o CSV: ${error.message}`));
        })
        .on('end', async () => {
          if (batch.length > 0) {
            insertPromises.push(this.insertBatch(batch));
          }
          try {
            await Promise.all(insertPromises);
            resolve('Dados do CSV processados e salvos com sucesso!');
          } catch (error) {
            this.logger.error(`Erro ao salvar os dados: ${error.message}`);
            reject(new BadRequestException(`Erro ao salvar os dados: ${error.message}`));
          }
        });
    });
  }

  private async insertBatch(batch: any[]): Promise<void> {
    try {
      await this.ingestionModel.insertMany(batch);
    } catch (error) {
      this.logger.error(`Erro ao salvar o lote: ${error.message}`);
      throw error;
    }
  }
}
