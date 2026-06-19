import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorsService } from './professors.service';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';

describe('ProfessorsService', () => {
  let service: ProfessorsService;
  let client: jest.Mocked<MicroserviceClient>;
  const authToken = 'Bearer token123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessorsService,
        {
          provide: MicroserviceClient,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfessorsService>(ProfessorsService);
    client = module.get(MicroserviceClient) as jest.Mocked<MicroserviceClient>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should call client.get with query', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.findAll({ page: '1' }, authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/professors', { params: { page: '1' }, authToken });
  });

  it('findOne should call client.get with id', async () => {
    client.get.mockResolvedValue({ id: 'p1' });
    await service.findOne('p1', authToken);
    expect(client.get).toHaveBeenCalledWith('adminpanel', '/api/admin/professors/p1', { authToken });
  });

  it('create should call client.post with data', async () => {
    const data = { nombre: 'Profesor' };
    client.post.mockResolvedValue({ id: 'p1' });
    await service.create(data, authToken);
    expect(client.post).toHaveBeenCalledWith('adminpanel', '/api/admin/professors', data, { authToken });
  });

  it('update should call client.patch with id and data', async () => {
    const data = { nombre: 'Updated' };
    client.patch.mockResolvedValue({ updated: true });
    await service.update('p1', data, authToken);
    expect(client.patch).toHaveBeenCalledWith('adminpanel', '/api/admin/professors/p1', data, { authToken });
  });

  it('delete should call client.delete with id', async () => {
    client.delete.mockResolvedValue({ deleted: true });
    await service.delete('p1', authToken);
    expect(client.delete).toHaveBeenCalledWith('adminpanel', '/api/admin/professors/p1', { authToken });
  });
});
