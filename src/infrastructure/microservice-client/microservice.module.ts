import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MicroserviceClient } from './microservice.client';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  providers: [MicroserviceClient],
  exports: [MicroserviceClient],
})
export class MicroserviceClientModule {}
