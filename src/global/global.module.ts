import { Module, Global } from '@nestjs/common';
import { GlobalService } from './global.service';

@Global()
@Module({
  providers: [GlobalService],
  exports: [GlobalService],
})
export class GlobalModule {}
