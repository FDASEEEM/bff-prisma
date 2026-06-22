import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service';

type UploadedFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

@ApiTags('jobs')
@ApiBearerAuth()
@Controller('api/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Crear job PACI y subir archivos (proxy a ms-docs)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        prompt: { type: 'string' },
        paciJson: { type: 'string' },
        paciFile: { type: 'string', format: 'binary' },
        planningFile: { type: 'string', format: 'binary' },
      },
      required: ['prompt', 'planningFile'],
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'paciFile', maxCount: 1 },
        { name: 'planningFile', maxCount: 1 },
      ],
      { limits: { fileSize: 25 * 1024 * 1024 } },
    ),
  )
  upload(
    @Body() body: { prompt?: string; paciJson?: string },
    @UploadedFiles()
    files: { paciFile?: UploadedFile[]; planningFile?: UploadedFile[] },
    @Headers('authorization') authorization: string,
  ) {
    return this.jobsService.uploadJob(body, files, authorization);
  }

  @Get()
  @ApiOperation({ summary: 'Listar jobs del usuario' })
  findAll(@Query() query: any, @Headers('authorization') authorization: string) {
    return this.jobsService.findAll(query, authorization);
  }

  @Get('history')
  @ApiOperation({ summary: 'Historial de sesiones' })
  getHistory(@Headers('authorization') authorization: string) {
    return this.jobsService.getHistory(authorization);
  }

  @Get('colegio/:colegioId/stats')
  @ApiOperation({ summary: 'Estadísticas de jobs por colegio' })
  getColegioStats(@Param('colegioId') colegioId: string, @Headers('authorization') authorization: string) {
    return this.jobsService.getColegioStats(colegioId, authorization);
  }

  @Get('colegio/:colegioId/jobs')
  @ApiOperation({ summary: 'Jobs de un colegio' })
  getColegioJobs(
    @Param('colegioId') colegioId: string,
    @Query() query: any,
    @Headers('authorization') authorization: string,
  ) {
    return this.jobsService.getColegioJobs(colegioId, query, authorization);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener job por ID' })
  findOne(@Param('id') id: string, @Headers('authorization') authorization: string) {
    return this.jobsService.findOne(id, authorization);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'URL de descarga' })
  getDownloadUrl(@Param('id') id: string, @Headers('authorization') authorization: string) {
    return this.jobsService.getDownloadUrl(id, authorization);
  }
}
