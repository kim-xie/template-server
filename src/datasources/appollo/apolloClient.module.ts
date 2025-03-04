import { Module, Global } from '@nestjs/common';
import { ApolloConfigService } from './apolloClient.service';
@Global()
@Module({
  providers: [ApolloConfigService],
  exports: [ApolloConfigService],
})
export class ApolloConfigModule {}
