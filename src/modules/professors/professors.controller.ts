import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfessorsService } from './professors.service';

@ApiTags('professors')
@ApiBearerAuth()
@Controller('api/professors')
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar profesores' })
  findAll(@Query() query: any, @Headers('authorization') authorization: string) {
    return this.professorsService.findAll(query, authorization);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener profesor' })
  findOne(@Param('id') id: string, @Headers('authorization') authorization: string) {
    return this.professorsService.findOne(id, authorization);
  }

  @Post()
  @ApiOperation({ summary: 'Crear profesor' })
  create(@Body() body: any, @Headers('authorization') authorization: string) {
    return this.professorsService.create(body, authorization);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar profesor' })
  update(@Param('id') id: string, @Body() body: any, @Headers('authorization') authorization: string) {
    return this.professorsService.update(id, body, authorization);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar profesor' })
  delete(@Param('id') id: string, @Headers('authorization') authorization: string) {
    return this.professorsService.delete(id, authorization);
  }
}
