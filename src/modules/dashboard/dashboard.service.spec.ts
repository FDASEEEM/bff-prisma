import { Test, TestingModule } from '@nestjs/testing';
import { BadGatewayException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';
import { ColegiosService } from '../colegios/colegios.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let client: jest.Mocked<MicroserviceClient>;
  let colegiosService: jest.Mocked<ColegiosService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: MicroserviceClient,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            patch: jest.fn(),
          },
        },
        {
          provide: ColegiosService,
          useValue: {
            findOne: jest.fn(),
            getStats: jest.fn(),
            getProfessors: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    client = module.get(MicroserviceClient) as jest.Mocked<MicroserviceClient>;
    colegiosService = module.get(ColegiosService) as jest.Mocked<ColegiosService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserDashboard', () => {
    it('should aggregate user and jobs data', async () => {
      const mockUser = { id: 'user-1', email: 'test@test.com' };
      const mockJobs = { items: [{ id: 'job-1' }], total: 1 };

      client.get
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockJobs);

      const result = await service.getUserDashboard('Bearer token', 'user-1');

      expect(result).toHaveProperty('user', mockUser);
      expect(result).toHaveProperty('recentJobs', mockJobs);
      expect(result).toHaveProperty('timestamp');
    });

    it('should throw BadGatewayException on error', async () => {
      client.get.mockRejectedValue(new Error('Service down'));

      await expect(service.getUserDashboard('Bearer token', 'user-1')).rejects.toThrow(BadGatewayException);
    });
  });

  describe('getColegioDashboard', () => {
    it('should aggregate colegio, stats, professors and consumo data', async () => {
      const mockColegio = { id: 'colegio-1', nombre: 'Test' };
      const mockStats = { totalUsers: 5 };
      const mockProfessors = { data: [], total: 0 };
      const mockConsumo = { totalJobs: 10 };

      colegiosService.findOne.mockResolvedValue(mockColegio);
      colegiosService.getStats.mockResolvedValue(mockStats);
      colegiosService.getProfessors.mockResolvedValue(mockProfessors);
      client.get.mockResolvedValue(mockConsumo);

      const result = await service.getColegioDashboard('colegio-1', 'Bearer token');

      expect(result).toHaveProperty('colegio', mockColegio);
      expect(result).toHaveProperty('stats', mockStats);
      expect(result).toHaveProperty('professors', mockProfessors);
      expect(result).toHaveProperty('consumo', mockConsumo);
      expect(result).toHaveProperty('timestamp');
    });

    it('should throw BadGatewayException on error', async () => {
      colegiosService.findOne.mockRejectedValue(new Error('Service down'));

      await expect(service.getColegioDashboard('colegio-1', 'Bearer token')).rejects.toThrow(BadGatewayException);
    });
  });
});
