import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

describe('JobsController', () => {
  let controller: JobsController;
  let jobsService: jest.Mocked<JobsService>;
  const authorization = 'Bearer token123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            getHistory: jest.fn(),
            getDownloadUrl: jest.fn(),
            getColegioStats: jest.fn(),
            getColegioJobs: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
    jobsService = module.get(JobsService) as jest.Mocked<JobsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should delegate to jobsService.findAll', async () => {
    const query = { page: '1' };
    jobsService.findAll.mockResolvedValue({ data: [] });
    const result = await controller.findAll(query, authorization);
    expect(jobsService.findAll).toHaveBeenCalledWith(query, authorization);
    expect(result).toEqual({ data: [] });
  });

  it('getHistory should delegate to jobsService.getHistory', async () => {
    jobsService.getHistory.mockResolvedValue({ data: [] });
    const result = await controller.getHistory(authorization);
    expect(jobsService.getHistory).toHaveBeenCalledWith(authorization);
    expect(result).toEqual({ data: [] });
  });

  it('getColegioStats should delegate to jobsService.getColegioStats', async () => {
    jobsService.getColegioStats.mockResolvedValue({ total: 5 });
    const result = await controller.getColegioStats('c1', authorization);
    expect(jobsService.getColegioStats).toHaveBeenCalledWith('c1', authorization);
    expect(result).toEqual({ total: 5 });
  });

  it('getColegioJobs should delegate to jobsService.getColegioJobs', async () => {
    const query = { page: '1' };
    jobsService.getColegioJobs.mockResolvedValue({ data: [] });
    const result = await controller.getColegioJobs('c1', query, authorization);
    expect(jobsService.getColegioJobs).toHaveBeenCalledWith('c1', query, authorization);
    expect(result).toEqual({ data: [] });
  });

  it('findOne should delegate to jobsService.findOne', async () => {
    jobsService.findOne.mockResolvedValue({ id: 'j1' });
    const result = await controller.findOne('j1', authorization);
    expect(jobsService.findOne).toHaveBeenCalledWith('j1', authorization);
    expect(result).toEqual({ id: 'j1' });
  });

  it('getDownloadUrl should delegate to jobsService.getDownloadUrl', async () => {
    jobsService.getDownloadUrl.mockResolvedValue({ url: 'http://example.com/file' });
    const result = await controller.getDownloadUrl('j1', authorization);
    expect(jobsService.getDownloadUrl).toHaveBeenCalledWith('j1', authorization);
    expect(result).toEqual({ url: 'http://example.com/file' });
  });
});
