import { Controller, Get, Headers, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('me')
  @ApiOperation({ summary: 'Dashboard del usuario autenticado' })
  async getUserDashboard(@Headers('authorization') authorization: string) {
    const me = await this.dashboardService['client'].get('users', '/api/auth/me', { authToken: authorization });
    return this.dashboardService.getUserDashboard(authorization, me.id);
  }

  @Get('colegio/:colegioId')
  @ApiOperation({ summary: 'Dashboard completo de un colegio' })
  getColegioDashboard(
    @Param('colegioId') colegioId: string,
    @Headers('authorization') authorization: string,
  ) {
    return this.dashboardService.getColegioDashboard(colegioId, authorization);
  }
}
