import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from './kafka/services/kafka-producer.service';
import { ProducerTest1Message, ProducerTest1MessageId } from './kafka/producers/producerTest1';

@Injectable()
export class AppService {

  constructor(
    private readonly kafkaProducerService: KafkaProducerService,
  ) { }

  getHello(): string {
    const message = new ProducerTest1Message();
    message.key = 'value';
    this.kafkaProducerService.sendEvent(ProducerTest1MessageId, {
      message
    });
    return 'Hello World!';
  }
}
