import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorsController } from './professors.controller';
import { ProfessorsService } from './professors.service';

describe('ProfessorsController', () => {
  let controller: ProfessorsController;
  let professorsService: jest.Mocked<ProfessorsService>;
  const authorization = 'Bearer token123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessorsController],
      providers: [
        {
          provide: ProfessorsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfessorsController>(ProfessorsController);
    professorsService = module.get(ProfessorsService) as jest.Mocked<ProfessorsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should delegate to professorsService.findAll', async () => {
    const query = { page: '1' };
    professorsService.findAll.mockResolvedValue({ data: [] });
    const result = await controller.findAll(query, authorization);
    expect(professorsService.findAll).toHaveBeenCalledWith(query, authorization);
    expect(result).toEqual({ data: [] });
  });

  it('findOne should delegate to professorsService.findOne', async () => {
    professorsService.findOne.mockResolvedValue({ id: 'p1' });
    const result = await controller.findOne('p1', authorization);
    expect(professorsService.findOne).toHaveBeenCalledWith('p1', authorization);
    expect(result).toEqual({ id: 'p1' });
  });

  it('create should delegate to professorsService.create', async () => {
    const body = { nombre: 'Profesor' };
    professorsService.create.mockResolvedValue({ id: 'p1' });
    const result = await controller.create(body, authorization);
    expect(professorsService.create).toHaveBeenCalledWith(body, authorization);
    expect(result).toEqual({ id: 'p1' });
  });

  it('update should delegate to professorsService.update', async () => {
    const body = { nombre: 'Updated' };
    professorsService.update.mockResolvedValue({ updated: true });
    const result = await controller.update('p1', body, authorization);
    expect(professorsService.update).toHaveBeenCalledWith('p1', body, authorization);
    expect(result).toEqual({ updated: true });
  });

  it('delete should delegate to professorsService.delete', async () => {
    professorsService.delete.mockResolvedValue({ deleted: true });
    const result = await controller.delete('p1', authorization);
    expect(professorsService.delete).toHaveBeenCalledWith('p1', authorization);
    expect(result).toEqual({ deleted: true });
  });
});
