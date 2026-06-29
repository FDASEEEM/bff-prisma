import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check del BFF' })
  health() {
    return {
      status: 'ok',
      service: 'prisma-bff',
      timestamp: new Date().toISOString(),
    };
  }
}
