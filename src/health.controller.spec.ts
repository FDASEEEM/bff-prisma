import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('health', () => {
    it('should return ok status with service name and timestamp', () => {
      const result = controller.health();

      expect(result).toEqual(
        expect.objectContaining({
          status: 'ok',
          service: 'prisma-bff',
          timestamp: expect.any(String),
        }),
      );
    });
  });
});
