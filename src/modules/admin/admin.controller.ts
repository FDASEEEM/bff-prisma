import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard
  @Get('dashboard/summary')
  @ApiOperation({ summary: 'Resumen del dashboard' })
  getSummary(@Headers('authorization') authorization: string) {
    return this.adminService.getDashboardSummary(authorization);
  }

  @Get('me')
  @ApiOperation({ summary: 'Perfil del admin' })
  getMe(@Headers('authorization') authorization: string) {
    return this.adminService.getMe(authorization);
  }

  // Users
  @Get('users/stats')
  @ApiOperation({ summary: 'Estadísticas de usuarios' })
  getUsersStats(@Headers('authorization') authorization: string) {
    return this.adminService.getUsersStats(authorization);
  }

  @Get('users')
  @ApiOperation({ summary: 'Listar usuarios' })
  getUsers(@Headers('authorization') authorization: string) {
    return this.adminService.getUsers(authorization);
  }

  @Post('users')
  @ApiOperation({ summary: 'Crear usuario' })
  createUser(@Body() body: any, @Headers('authorization') authorization: string) {
    return this.adminService.createUser(body, authorization);
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Cambiar rol de usuario' })
  updateUserRole(
    @Param('id') id: string,
    @Body() body: any,
    @Headers('authorization') authorization: string,
  ) {
    return this.adminService.updateUserRole(id, body, authorization);
  }

  // Tickets
  @Get('tickets')
  @ApiOperation({ summary: 'Listar tickets' })
  getTickets(@Query() query: any, @Headers('authorization') authorization: string) {
    return this.adminService.getTickets(query, authorization);
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Obtener ticket' })
  getTicket(@Param('id') id: string, @Headers('authorization') authorization: string) {
    return this.adminService.getTicket(id, authorization);
  }

  @Post('tickets')
  @ApiOperation({ summary: 'Crear ticket' })
  createTicket(@Body() body: any, @Headers('authorization') authorization: string) {
    return this.adminService.createTicket(body, authorization);
  }

  @Patch('tickets/:id')
  @ApiOperation({ summary: 'Actualizar ticket' })
  updateTicket(
    @Param('id') id: string,
    @Body() body: any,
    @Headers('authorization') authorization: string,
  ) {
    return this.adminService.updateTicket(id, body, authorization);
  }

  @Delete('tickets/:id')
  @ApiOperation({ summary: 'Eliminar ticket' })
  deleteTicket(@Param('id') id: string, @Headers('authorization') authorization: string) {
    return this.adminService.deleteTicket(id, authorization);
  }

  // Resources
  @Get('resources')
  @ApiOperation({ summary: 'Listar recursos' })
  getResources(@Query() query: any, @Headers('authorization') authorization: string) {
    return this.adminService.getResources(query, authorization);
  }

  @Post('resources')
  @ApiOperation({ summary: 'Crear recurso' })
  createResource(@Body() body: any, @Headers('authorization') authorization: string) {
    return this.adminService.createResource(body, authorization);
  }

  @Patch('resources/:id')
  @ApiOperation({ summary: 'Actualizar recurso' })
  updateResource(
    @Param('id') id: string,
    @Body() body: any,
    @Headers('authorization') authorization: string,
  ) {
    return this.adminService.updateResource(id, body, authorization);
  }

  @Delete('resources/:id')
  @ApiOperation({ summary: 'Eliminar recurso' })
  deleteResource(@Param('id') id: string, @Headers('authorization') authorization: string) {
    return this.adminService.deleteResource(id, authorization);
  }

  // Announcements
  @Get('announcements')
  @ApiOperation({ summary: 'Listar anuncios' })
  getAnnouncements(@Query() query: any, @Headers('authorization') authorization: string) {
    return this.adminService.getAnnouncements(query, authorization);
  }

  @Post('announcements')
  @ApiOperation({ summary: 'Crear anuncio' })
  createAnnouncement(@Body() body: any, @Headers('authorization') authorization: string) {
    return this.adminService.createAnnouncement(body, authorization);
  }

  @Patch('announcements/:id')
  @ApiOperation({ summary: 'Actualizar anuncio' })
  updateAnnouncement(
    @Param('id') id: string,
    @Body() body: any,
    @Headers('authorization') authorization: string,
  ) {
    return this.adminService.updateAnnouncement(id, body, authorization);
  }

  @Delete('announcements/:id')
  @ApiOperation({ summary: 'Eliminar anuncio' })
  deleteAnnouncement(@Param('id') id: string, @Headers('authorization') authorization: string) {
    return this.adminService.deleteAnnouncement(id, authorization);
  }

  // Colegio Stats
  @Get('colegio-stats/:colegioId/professors')
  @ApiOperation({ summary: 'Estadísticas de profesores de un colegio' })
  getColegioProfessorsStats(
    @Param('colegioId') colegioId: string,
    @Headers('authorization') authorization: string,
  ) {
    return this.adminService.getColegioProfessorsStats(colegioId, authorization);
  }

  @Get('colegio-stats/:colegioId/consumo')
  @ApiOperation({ summary: 'Estadísticas de consumo de un colegio' })
  getColegioConsumoStats(
    @Param('colegioId') colegioId: string,
    @Headers('authorization') authorization: string,
  ) {
    return this.adminService.getColegioConsumoStats(colegioId, authorization);
  }

  @Get('colegio-stats/:colegioId/full')
  @ApiOperation({ summary: 'Estadísticas completas de un colegio' })
  getColegioFullStats(
    @Param('colegioId') colegioId: string,
    @Headers('authorization') authorization: string,
  ) {
    return this.adminService.getColegioFullStats(colegioId, authorization);
  }
}
