import { Injectable, BadGatewayException } from '@nestjs/common';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';
import { ColegiosService } from '../colegios/colegios.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly client: MicroserviceClient,
    private readonly colegiosService: ColegiosService,
  ) {}

  async getUserDashboard(authToken: string, userId: string) {
    try {
      const [me, jobs] = await Promise.all([
        this.client.get('users', '/api/auth/me', { authToken }),
        this.client.get('docs', '/api/jobs', { params: { page: 1, limit: 5 }, authToken }),
      ]);

      return {
        user: me,
        recentJobs: jobs,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new BadGatewayException(`Error fetching user dashboard: ${error.message}`);
    }
  }

  async getColegioDashboard(colegioId: string, authToken: string) {
    try {
      const [colegio, stats, professors, consumo] = await Promise.all([
        this.colegiosService.findOne(colegioId, authToken),
        this.colegiosService.getStats(colegioId, authToken),
        this.colegiosService.getProfessors(colegioId, { page: 1, limit: 20 }, authToken),
        this.client.get('docs', `/api/jobs/colegio/${colegioId}/stats`, { authToken }),
      ]);

      return {
        colegio,
        stats,
        professors,
        consumo,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new BadGatewayException(`Error fetching colegio dashboard: ${error.message}`);
    }
  }
}
