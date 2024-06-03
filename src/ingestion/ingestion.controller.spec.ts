import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if no file is provided', async () => {
      await expect(controller.create(null)).rejects.toThrowError('File not provided');
    });

    it('should call ingestionService.create with the provided file', async () => {
      const file = { originalname: 'testfile', buffer: Buffer.from('test') } as Express.Multer.File;
      const createSpy = jest.spyOn(service, 'create').mockResolvedValue('testResponse');

      const response = await controller.create(file);

      expect(createSpy).toHaveBeenCalledWith(file);
      expect(response).toBe('testResponse');
    });
  });
});
