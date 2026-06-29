import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let dashboardService: any;
  const authorization = 'Bearer token123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: {
            getUserDashboard: jest.fn(),
            getColegioDashboard: jest.fn(),
            client: {
              get: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    dashboardService = module.get(DashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserDashboard', () => {
    it('should fetch current user id and delegate to dashboardService.getUserDashboard', async () => {
      dashboardService.client.get.mockResolvedValue({ id: 'user-1', email: 'test@test.com' });
      const mockDashboard = { user: { id: 'user-1' }, recentJobs: { items: [] }, timestamp: '2024-01-01' };
      dashboardService.getUserDashboard.mockResolvedValue(mockDashboard);

      const result = await controller.getUserDashboard(authorization);

      expect(dashboardService.client.get).toHaveBeenCalledWith('users', '/api/auth/me', { authToken: authorization });
      expect(dashboardService.getUserDashboard).toHaveBeenCalledWith(authorization, 'user-1');
      expect(result).toEqual(mockDashboard);
    });
  });

  describe('getColegioDashboard', () => {
    it('should delegate to dashboardService.getColegioDashboard', async () => {
      const mockDashboard = { colegio: { id: 'colegio-1' }, stats: {}, professors: {}, consumo: {}, timestamp: '2024-01-01' };
      dashboardService.getColegioDashboard.mockResolvedValue(mockDashboard);

      const result = await controller.getColegioDashboard('colegio-1', authorization);

      expect(dashboardService.getColegioDashboard).toHaveBeenCalledWith('colegio-1', authorization);
      expect(result).toEqual(mockDashboard);
    });
  });
});
