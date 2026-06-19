import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

describe('StudentsController', () => {
  let controller: StudentsController;
  let studentsService: jest.Mocked<StudentsService>;
  const authorization = 'Bearer token123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: {
            findAll: jest.fn(),
            findMe: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findPaciProfiles: jest.fn(),
            createPaciProfile: jest.fn(),
            getPaciProfile: jest.fn(),
            updatePaciProfile: jest.fn(),
            deletePaciProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
    studentsService = module.get(StudentsService) as jest.Mocked<StudentsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should delegate to studentsService.findAll', async () => {
    studentsService.findAll.mockResolvedValue({ data: [] });
    const result = await controller.findAll(authorization);
    expect(studentsService.findAll).toHaveBeenCalledWith(authorization);
    expect(result).toEqual({ data: [] });
  });

  it('findMe should delegate to studentsService.findMe', async () => {
    studentsService.findMe.mockResolvedValue({ id: 's1' });
    const result = await controller.findMe(authorization);
    expect(studentsService.findMe).toHaveBeenCalledWith(authorization);
    expect(result).toEqual({ id: 's1' });
  });

  it('findOne should delegate to studentsService.findOne', async () => {
    studentsService.findOne.mockResolvedValue({ id: 's1' });
    const result = await controller.findOne('s1', authorization);
    expect(studentsService.findOne).toHaveBeenCalledWith('s1', authorization);
    expect(result).toEqual({ id: 's1' });
  });

  it('create should delegate to studentsService.create', async () => {
    const body = { nombre: 'Estudiante' };
    studentsService.create.mockResolvedValue({ id: 's1' });
    const result = await controller.create(body, authorization);
    expect(studentsService.create).toHaveBeenCalledWith(body, authorization);
    expect(result).toEqual({ id: 's1' });
  });

  it('update should delegate to studentsService.update', async () => {
    const body = { nombre: 'Updated' };
    studentsService.update.mockResolvedValue({ updated: true });
    const result = await controller.update('s1', body, authorization);
    expect(studentsService.update).toHaveBeenCalledWith('s1', body, authorization);
    expect(result).toEqual({ updated: true });
  });

  it('delete should delegate to studentsService.delete', async () => {
    studentsService.delete.mockResolvedValue({ deleted: true });
    const result = await controller.delete('s1', authorization);
    expect(studentsService.delete).toHaveBeenCalledWith('s1', authorization);
    expect(result).toEqual({ deleted: true });
  });

  it('findPaciProfiles should delegate to studentsService.findPaciProfiles', async () => {
    const query = { page: '1' };
    studentsService.findPaciProfiles.mockResolvedValue({ data: [] });
    const result = await controller.findPaciProfiles(query, authorization);
    expect(studentsService.findPaciProfiles).toHaveBeenCalledWith(query, authorization);
    expect(result).toEqual({ data: [] });
  });

  it('createPaciProfile should delegate to studentsService.createPaciProfile', async () => {
    const body = { studentId: 's1' };
    studentsService.createPaciProfile.mockResolvedValue({ id: 'pp1' });
    const result = await controller.createPaciProfile(body, authorization);
    expect(studentsService.createPaciProfile).toHaveBeenCalledWith(body, authorization);
    expect(result).toEqual({ id: 'pp1' });
  });

  it('getPaciProfile should delegate to studentsService.getPaciProfile', async () => {
    studentsService.getPaciProfile.mockResolvedValue({ id: 'pp1' });
    const result = await controller.getPaciProfile('pp1', authorization);
    expect(studentsService.getPaciProfile).toHaveBeenCalledWith('pp1', authorization);
    expect(result).toEqual({ id: 'pp1' });
  });

  it('updatePaciProfile should delegate to studentsService.updatePaciProfile', async () => {
    const body = { notes: 'Updated' };
    studentsService.updatePaciProfile.mockResolvedValue({ updated: true });
    const result = await controller.updatePaciProfile('pp1', body, authorization);
    expect(studentsService.updatePaciProfile).toHaveBeenCalledWith('pp1', body, authorization);
    expect(result).toEqual({ updated: true });
  });

  it('deletePaciProfile should delegate to studentsService.deletePaciProfile', async () => {
    studentsService.deletePaciProfile.mockResolvedValue({ deleted: true });
    const result = await controller.deletePaciProfile('pp1', authorization);
    expect(studentsService.deletePaciProfile).toHaveBeenCalledWith('pp1', authorization);
    expect(result).toEqual({ deleted: true });
  });
});
