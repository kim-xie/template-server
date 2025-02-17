import { DynamicModule, Global, Module } from '@nestjs/common';
import { KafkaConfig } from './kafka.message';
import { KafkaService } from './kafka.service';

@Global()
@Module({
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {
  // static register(kafkaConfig: KafkaConfig): DynamicModule {
  //   return {
  //     global: true,
  //     module: KafkaModule,
  //     providers: [
  //       {
  //         provide: KafkaService,
  //         useValue: new KafkaService(kafkaConfig),
  //       },
  //     ],
  //     exports: [KafkaService],
  //   };
  // }
}
