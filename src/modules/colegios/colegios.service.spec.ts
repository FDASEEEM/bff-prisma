import { Test, TestingModule } from '@nestjs/testing';
import { ColegiosService } from './colegios.service';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';

describe('ColegiosService', () => {
  let service: ColegiosService;
  let client: jest.Mocked<MicroserviceClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColegiosService,
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

    service = module.get<ColegiosService>(ColegiosService);
    client = module.get(MicroserviceClient) as jest.Mocked<MicroserviceClient>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should call client.get with correct params', async () => {
    client.get.mockResolvedValue({ data: [], total: 0 });
    await service.findAll({ page: '1' }, 'Bearer token');
    expect(client.get).toHaveBeenCalledWith(
      'users',
      '/api/superadmin/colegios',
      { params: { page: '1' }, authToken: 'Bearer token' },
    );
  });

  it('findOne should call client.get with id', async () => {
    client.get.mockResolvedValue({ id: '1' });
    await service.findOne('colegio-1', 'Bearer token');
    expect(client.get).toHaveBeenCalledWith(
      'users',
      '/api/superadmin/colegios/colegio-1',
      { authToken: 'Bearer token' },
    );
  });

  it('create should call client.post with data', async () => {
    const data = { nombre: 'Test' };
    client.post.mockResolvedValue({ id: '1' });
    await service.create(data, 'Bearer token');
    expect(client.post).toHaveBeenCalledWith(
      'users',
      '/api/superadmin/colegios',
      data,
      { authToken: 'Bearer token' },
    );
  });

  it('update should call client.patch with id and data', async () => {
    client.patch.mockResolvedValue({ updated: true });
    await service.update('colegio-1', { nombre: 'Updated' }, 'Bearer token');
    expect(client.patch).toHaveBeenCalledWith(
      'users',
      '/api/superadmin/colegios/colegio-1',
      { nombre: 'Updated' },
      { authToken: 'Bearer token' },
    );
  });

  it('deactivate should call client.delete with id', async () => {
    client.delete.mockResolvedValue({ id: '1', activo: false });
    await service.deactivate('colegio-1', 'Bearer token');
    expect(client.delete).toHaveBeenCalledWith(
      'users',
      '/api/superadmin/colegios/colegio-1',
      { authToken: 'Bearer token' },
    );
  });

  it('getStats should call client.get with id', async () => {
    client.get.mockResolvedValue({ totalUsers: 5 });
    await service.getStats('colegio-1', 'Bearer token');
    expect(client.get).toHaveBeenCalledWith(
      'users',
      '/api/superadmin/colegios/colegio-1/stats',
      { authToken: 'Bearer token' },
    );
  });

  it('getProfessors should call client.get with id and query', async () => {
    client.get.mockResolvedValue({ data: [], total: 0 });
    await service.getProfessors('colegio-1', { page: '1' }, 'Bearer token');
    expect(client.get).toHaveBeenCalledWith(
      'users',
      '/api/superadmin/colegios/colegio-1/professors',
      { params: { page: '1' }, authToken: 'Bearer token' },
    );
  });

  it('getAdmins should call client.get with id', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.getAdmins('colegio-1', 'Bearer token');
    expect(client.get).toHaveBeenCalledWith(
      'users',
      '/api/superadmin/colegios/colegio-1/admins',
      { authToken: 'Bearer token' },
    );
  });
});
