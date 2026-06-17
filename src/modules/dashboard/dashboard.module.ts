import { Module } from '@nestjs/common';
import { ColegiosModule } from '../colegios/colegios.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [ColegiosModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
