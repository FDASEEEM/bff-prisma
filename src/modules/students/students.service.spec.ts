import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { MicroserviceClient } from '../../infrastructure/microservice-client/microservice.client';

describe('StudentsService', () => {
  let service: StudentsService;
  let client: jest.Mocked<MicroserviceClient>;
  const authToken = 'Bearer token123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
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

    service = module.get<StudentsService>(StudentsService);
    client = module.get(MicroserviceClient) as jest.Mocked<MicroserviceClient>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should call client.get', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.findAll(authToken);
    expect(client.get).toHaveBeenCalledWith('perfil', '/students', { authToken });
  });

  it('findOne should call client.get with id', async () => {
    client.get.mockResolvedValue({ id: 's1' });
    await service.findOne('s1', authToken);
    expect(client.get).toHaveBeenCalledWith('perfil', '/students/s1', { authToken });
  });

  it('create should call client.post with data', async () => {
    const data = { nombre: 'Estudiante' };
    client.post.mockResolvedValue({ id: 's1' });
    await service.create(data, authToken);
    expect(client.post).toHaveBeenCalledWith('perfil', '/students', data, { authToken });
  });

  it('update should call client.patch with id and data', async () => {
    const data = { nombre: 'Updated' };
    client.patch.mockResolvedValue({ updated: true });
    await service.update('s1', data, authToken);
    expect(client.patch).toHaveBeenCalledWith('perfil', '/students/s1', data, { authToken });
  });

  it('delete should call client.delete with id', async () => {
    client.delete.mockResolvedValue({ deleted: true });
    await service.delete('s1', authToken);
    expect(client.delete).toHaveBeenCalledWith('perfil', '/students/s1', { authToken });
  });

  it('findMe should call client.get', async () => {
    client.get.mockResolvedValue({ id: 's1' });
    await service.findMe(authToken);
    expect(client.get).toHaveBeenCalledWith('perfil', '/students/me', { authToken });
  });

  it('findPaciProfiles should call client.get with query', async () => {
    client.get.mockResolvedValue({ data: [] });
    await service.findPaciProfiles({ page: '1' }, authToken);
    expect(client.get).toHaveBeenCalledWith('perfil', '/paci-profiles', { params: { page: '1' }, authToken });
  });

  it('createPaciProfile should call client.post with data', async () => {
    const data = { studentId: 's1' };
    client.post.mockResolvedValue({ id: 'pp1' });
    await service.createPaciProfile(data, authToken);
    expect(client.post).toHaveBeenCalledWith('perfil', '/paci-profiles', data, { authToken });
  });

  it('getPaciProfile should call client.get with id', async () => {
    client.get.mockResolvedValue({ id: 'pp1' });
    await service.getPaciProfile('pp1', authToken);
    expect(client.get).toHaveBeenCalledWith('perfil', '/paci-profiles/pp1', { authToken });
  });

  it('updatePaciProfile should call client.patch with id and data', async () => {
    const data = { notes: 'Updated' };
    client.patch.mockResolvedValue({ updated: true });
    await service.updatePaciProfile('pp1', data, authToken);
    expect(client.patch).toHaveBeenCalledWith('perfil', '/paci-profiles/pp1', data, { authToken });
  });

  it('deletePaciProfile should call client.delete with id', async () => {
    client.delete.mockResolvedValue({ deleted: true });
    await service.deletePaciProfile('pp1', authToken);
    expect(client.delete).toHaveBeenCalledWith('perfil', '/paci-profiles/pp1', { authToken });
  });
});
