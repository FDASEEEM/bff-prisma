import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentsService } from './students.service';

@ApiTags('students')
@ApiBearerAuth()
@Controller('api/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar estudiantes' })
  findAll(@Headers('authorization') authorization: string) {
    return this.studentsService.findAll(authorization);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener mi estudiante' })
  findMe(@Headers('authorization') authorization: string) {
    return this.studentsService.findMe(authorization);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener estudiante' })
  findOne(@Param('id') id: string, @Headers('authorization') authorization: string) {
    return this.studentsService.findOne(id, authorization);
  }

  @Post()
  @ApiOperation({ summary: 'Crear estudiante' })
  create(@Body() body: any, @Headers('authorization') authorization: string) {
    return this.studentsService.create(body, authorization);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar estudiante' })
  update(@Param('id') id: string, @Body() body: any, @Headers('authorization') authorization: string) {
    return this.studentsService.update(id, body, authorization);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar estudiante' })
  delete(@Param('id') id: string, @Headers('authorization') authorization: string) {
    return this.studentsService.delete(id, authorization);
  }

  // PACI Profile endpoints
  @Get('paci-profiles/all')
  @ApiOperation({ summary: 'Listar perfiles PACI' })
  findPaciProfiles(@Query() query: any, @Headers('authorization') authorization: string) {
    return this.studentsService.findPaciProfiles(query, authorization);
  }

  @Post('paci-profiles/create')
  @ApiOperation({ summary: 'Crear perfil PACI' })
  createPaciProfile(@Body() body: any, @Headers('authorization') authorization: string) {
    return this.studentsService.createPaciProfile(body, authorization);
  }

  @Get('paci-profiles/:id')
  @ApiOperation({ summary: 'Obtener perfil PACI' })
  getPaciProfile(@Param('id') id: string, @Headers('authorization') authorization: string) {
    return this.studentsService.getPaciProfile(id, authorization);
  }

  @Patch('paci-profiles/:id')
  @ApiOperation({ summary: 'Actualizar perfil PACI' })
  updatePaciProfile(@Param('id') id: string, @Body() body: any, @Headers('authorization') authorization: string) {
    return this.studentsService.updatePaciProfile(id, body, authorization);
  }

  @Delete('paci-profiles/:id')
  @ApiOperation({ summary: 'Eliminar perfil PACI' })
  deletePaciProfile(@Param('id') id: string, @Headers('authorization') authorization: string) {
    return this.studentsService.deletePaciProfile(id, authorization);
  }
}
