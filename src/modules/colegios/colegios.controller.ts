import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ColegiosService } from './colegios.service';

@ApiTags('colegios')
@ApiBearerAuth()
@Controller('api/colegios')
export class ColegiosController {
  constructor(private readonly colegiosService: ColegiosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar colegios (paginado)' })
  findAll(@Query() query: any, @Headers('authorization') authorization: string) {
    return this.colegiosService.findAll(query, authorization);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener colegio por ID' })
  findOne(@Param('id') id: string, @Headers('authorization') authorization: string) {
    return this.colegiosService.findOne(id, authorization);
  }

  @Post()
  @ApiOperation({ summary: 'Crear colegio con su primer admin' })
  create(@Body() body: any, @Headers('authorization') authorization: string) {
    return this.colegiosService.create(body, authorization);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar colegio' })
  update(@Param('id') id: string, @Body() body: any, @Headers('authorization') authorization: string) {
    return this.colegiosService.update(id, body, authorization);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar colegio (soft delete)' })
  deactivate(@Param('id') id: string, @Headers('authorization') authorization: string) {
    return this.colegiosService.deactivate(id, authorization);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Estadísticas del colegio' })
  getStats(@Param('id') id: string, @Headers('authorization') authorization: string) {
    return this.colegiosService.getStats(id, authorization);
  }

  @Get(':id/professors')
  @ApiOperation({ summary: 'Profesores del colegio (paginado)' })
  getProfessors(@Param('id') id: string, @Query() query: any, @Headers('authorization') authorization: string) {
    return this.colegiosService.getProfessors(id, query, authorization);
  }
}
