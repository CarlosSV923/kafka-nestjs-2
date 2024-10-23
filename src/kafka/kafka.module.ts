import { Global, Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { KAFKA_CLIENT_CONFIG } from "./configuration/kafkaClient.config";
import { ConfigService } from "@nestjs/config";
import { KafkaClientBuilder } from "./builders/kafkaClient.builder";
import { Partitioners } from "kafkajs";
import { KafkaConsumerService } from "./services/kafka-consumer.service";
import { KafkaProducerService } from "./services/kafka-producer.service";
import { ConsumerTest1ServiceName } from "./consumers/consumerTest1";
import { ProducerTest1MessageId } from "./producers/producerTest1";
import { consumers } from "./consumers";

@Global()
@Module({
    imports: [
        DiscoveryModule
    ],
    providers: [
        {
            inject: [ConfigService],
            provide: KAFKA_CLIENT_CONFIG,
            useFactory: (configService: ConfigService) => {
                return new KafkaClientBuilder()
                    .withClientConfig({
                        clientId: configService.get('KAFKA_CLIENT_ID'),
                        brokers: configService.get<string[]>('KAFKA_BROKERS')
                    })
                    .withConsumerConfig({
                        groupId: configService.get('KAFKA_GROUP_ID'),
                        fromBeginning: configService.get('KAFKA_FROM_BEGINNING'),
                        retry: {
                            initialRetryTime: 100,
                            retries: 10,
                        },
                        allowAutoTopicCreation: true,
                    })
                    .withProducerConfig({
                        allowAutoTopicCreation: true,
                        createPartitioner: Partitioners.DefaultPartitioner,
                        retry: {
                            initialRetryTime: 100,
                            retries: 10
                        },
                    })
                    .addConsumerHandler(
                        builder => builder
                                    .withHandler(ConsumerTest1ServiceName)
                                    .withTopic(configService.get('KAFKA_TOPIC_CONSUMER_TEST1'))
                    )
                    .addProducerEvent(
                        builder => builder
                                    .withTopic(configService.get('KAFKA_TOPIC_PRODUCER_TEST1'))
                                    .withEventId(ProducerTest1MessageId)
                    )
                    .build();
            }
        },
        ...consumers,
        KafkaConsumerService,
        KafkaProducerService,
    ],
    exports: [
        KafkaProducerService
    ]
})
export class KafkaModule {

}