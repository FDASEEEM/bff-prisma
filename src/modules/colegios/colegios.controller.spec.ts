import { Test, TestingModule } from '@nestjs/testing';
import { ColegiosController } from './colegios.controller';
import { ColegiosService } from './colegios.service';

describe('ColegiosController', () => {
  let controller: ColegiosController;
  let colegiosService: jest.Mocked<ColegiosService>;
  const authorization = 'Bearer token123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColegiosController],
      providers: [
        {
          provide: ColegiosService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            deactivate: jest.fn(),
            getStats: jest.fn(),
            getProfessors: jest.fn(),
            getAdmins: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ColegiosController>(ColegiosController);
    colegiosService = module.get(ColegiosService) as jest.Mocked<ColegiosService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should delegate to colegiosService.findAll', async () => {
    const query = { page: '1' };
    colegiosService.findAll.mockResolvedValue({ data: [], total: 0 });
    const result = await controller.findAll(query, authorization);
    expect(colegiosService.findAll).toHaveBeenCalledWith(query, authorization);
    expect(result).toEqual({ data: [], total: 0 });
  });

  it('findOne should delegate to colegiosService.findOne', async () => {
    colegiosService.findOne.mockResolvedValue({ id: 'c1' });
    const result = await controller.findOne('c1', authorization);
    expect(colegiosService.findOne).toHaveBeenCalledWith('c1', authorization);
    expect(result).toEqual({ id: 'c1' });
  });

  it('create should delegate to colegiosService.create', async () => {
    const body = { nombre: 'Colegio' };
    colegiosService.create.mockResolvedValue({ id: 'c1' });
    const result = await controller.create(body, authorization);
    expect(colegiosService.create).toHaveBeenCalledWith(body, authorization);
    expect(result).toEqual({ id: 'c1' });
  });

  it('update should delegate to colegiosService.update', async () => {
    const body = { nombre: 'Updated' };
    colegiosService.update.mockResolvedValue({ updated: true });
    const result = await controller.update('c1', body, authorization);
    expect(colegiosService.update).toHaveBeenCalledWith('c1', body, authorization);
    expect(result).toEqual({ updated: true });
  });

  it('deactivate should delegate to colegiosService.deactivate', async () => {
    colegiosService.deactivate.mockResolvedValue({ id: 'c1', activo: false });
    const result = await controller.deactivate('c1', authorization);
    expect(colegiosService.deactivate).toHaveBeenCalledWith('c1', authorization);
    expect(result).toEqual({ id: 'c1', activo: false });
  });

  it('getStats should delegate to colegiosService.getStats', async () => {
    colegiosService.getStats.mockResolvedValue({ totalUsers: 5 });
    const result = await controller.getStats('c1', authorization);
    expect(colegiosService.getStats).toHaveBeenCalledWith('c1', authorization);
    expect(result).toEqual({ totalUsers: 5 });
  });

  it('getProfessors should delegate to colegiosService.getProfessors', async () => {
    const query = { page: '1' };
    colegiosService.getProfessors.mockResolvedValue({ data: [], total: 0 });
    const result = await controller.getProfessors('c1', query, authorization);
    expect(colegiosService.getProfessors).toHaveBeenCalledWith('c1', query, authorization);
    expect(result).toEqual({ data: [], total: 0 });
  });

  it('getAdmins should delegate to colegiosService.getAdmins', async () => {
    colegiosService.getAdmins.mockResolvedValue({ data: [] });
    const result = await controller.getAdmins('c1', authorization);
    expect(colegiosService.getAdmins).toHaveBeenCalledWith('c1', authorization);
    expect(result).toEqual({ data: [] });
  });
});
