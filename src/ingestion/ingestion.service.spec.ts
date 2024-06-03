import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { Ingestion } from './entities/ingestion.entity';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { IngestionSchema } from './schemas';

describe('IngestionService', () => {
  let service: IngestionService;
  let ingestionModel: mongoose.Model<Ingestion>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: 'INGESTION_MODEL',
          useValue: {
            insertMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    ingestionModel = module.get<mongoose.Model<Ingestion>>('INGESTION_MODEL');
  });

  it('should process and save CSV data successfully', async () => {
    const mockFile: Express.Multer.File = {
      buffer: Buffer.from('header1,header2\nvalue1,value2\nvalue3,value4'),
      originalname: 'test.csv',
      mimetype: 'text/csv',
      size: 1000,
      stream: null,
      destination: '',
      filename: '',
      path: '',
      fieldname: '',
      encoding: '',
    };

    jest.spyOn(ingestionModel, 'insertMany').mockResolvedValueOnce(null);

    const result = await service.create(mockFile);

    expect(result).toBe('Dados do CSV processados e salvos com sucesso!');
    expect(ingestionModel.insertMany).toHaveBeenCalledWith([
      { header1: 'value1', header2: 'value2' },
      { header1: 'value3', header2: 'value4' },
    ]);
  });

  it('should throw an error when saving data fails', async () => {
    const mockFile: Express.Multer.File = {
      buffer: Buffer.from('header1,header2\nvalue1,value2\nvalue3,value4'),
      originalname: 'test.csv',
      mimetype: 'text/csv',
      size: 1000,
      stream: null,
      destination: '',
      filename: '',
      path: '',
      fieldname: '',
      encoding: '',
    };

    jest.spyOn(ingestionModel, 'insertMany').mockRejectedValueOnce(new Error('Database error'));

    await expect(service.create(mockFile)).rejects.toThrow('Erro ao salvar os dados: Database error');
  });
  
});
