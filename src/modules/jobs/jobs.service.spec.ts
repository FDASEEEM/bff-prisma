import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';

describe('JobsService', () => {
  let service: JobsService;
  let client: jest.Mocked<MicroserviceClient>;
  const authToken = 'Bearer token123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: MicroserviceClient,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    client = module.get(MicroserviceClient) as jest.Mocked<MicroserviceClient>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should call client.get with query', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.findAll({ page: '1' }, authToken);
    expect(client.get).toHaveBeenCalledWith('docs', '/api/jobs', { params: { page: '1' }, authToken });
  });

  it('findOne should call client.get with id', async () => {
    client.get.mockResolvedValue({ id: 'j1' });
    await service.findOne('j1', authToken);
    expect(client.get).toHaveBeenCalledWith('docs', '/api/jobs/j1', { authToken });
  });

  it('getHistory should call client.get', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getHistory(authToken);
    expect(client.get).toHaveBeenCalledWith('docs', '/api/jobs/history', { authToken });
  });

  it('getDownloadUrl should call client.get with id', async () => {
    client.get.mockResolvedValue({ url: 'http://example.com/file' });
    await service.getDownloadUrl('j1', authToken);
    expect(client.get).toHaveBeenCalledWith('docs', '/api/jobs/j1/download', { authToken });
  });

  it('getColegioStats should call client.get with colegioId', async () => {
    client.get.mockResolvedValue({ total: 5 });
    await service.getColegioStats('c1', authToken);
    expect(client.get).toHaveBeenCalledWith('docs', '/api/jobs/colegio/c1/stats', { authToken });
  });

  it('getColegioJobs should call client.get with colegioId and query', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getColegioJobs('c1', { page: '1' }, authToken);
    expect(client.get).toHaveBeenCalledWith('docs', '/api/jobs/colegio/c1/jobs', { params: { page: '1' }, authToken });
  });
});
