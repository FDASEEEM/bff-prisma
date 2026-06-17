import { Controller, Get, Headers, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service';

@ApiTags('jobs')
@ApiBearerAuth()
@Controller('api/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

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
