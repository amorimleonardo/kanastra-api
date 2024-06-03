import { Controller, Get, Post, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not provided');
    }
    return await this.ingestionService.create(file);
  }
}