import { Module } from '@nestjs/common';
import { ApolloConfigService } from './apolloClient.service';
@Module({
  providers: [ApolloConfigService],
  exports: [ApolloConfigService],
})
export class ApolloClientModule {}
