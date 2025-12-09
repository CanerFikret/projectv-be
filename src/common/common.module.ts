import { Module } from '@nestjs/common';
import { GlobalServicesModule } from './global-services/global-services.module';

@Module({
  imports: [GlobalServicesModule],
})
export class CommonModule {}
