import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { KAFKA_CLIENT_CONFIG, KafkaClientConfig } from "../configuration/kafkaClient.config";
import { CompressionTypes, Producer } from "kafkajs";
import { ProducerEvent } from "../interfaces/producer-event.interface";

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {

    private readonly logger = new Logger(KafkaProducerService.name);
    private readonly producerInstance: Producer;

    constructor(
        @Inject(KAFKA_CLIENT_CONFIG)
        private readonly kafkaClientConfig: KafkaClientConfig
    ) {
        this.producerInstance = this.kafkaClientConfig.producer;
    }

    async onModuleDestroy(): Promise<void> {

        try {
            await this.producerInstance.disconnect();
            this.logger.log('Successfully disconnected from Kafka ');
        } catch (error) {
            this.logger.error('Error disconnecting from Kafka', error);
        }

    }

    async onModuleInit(): Promise<void> {

        try {
            await this.producerInstance.connect();
            this.logger.log('Successfully connected to Kafka');
        } catch (error) {
            this.logger.error('Error connecting to Kafka', error);
        }
    }


    sendEvent(eventId: string, record: ProducerEvent): void {
        const { events } = this.kafkaClientConfig;
        const topic = events.find(event => event.eventId === eventId)?.topic;
        if(!topic) {
            this.logger.warn(`No topic found for event ${eventId}`);
            return;
        }
        this.producerInstance.send({
            topic,
            messages: [
                {
                    key: record.key,
                    value: JSON.stringify(record.message),
                    headers: record.headers,
                    timestamp: record.timestamp,
                    partition: record.partition
                }
            ],
            acks: record.acks,
            compression: record.compression || CompressionTypes.GZIP,
            timeout: record.timeout,
        }).then(result => {
            result.forEach(r => {
                this.logger.log(`Message sent to topic: ${topic} with offset: ${r.baseOffset} and partition: ${r.partition}`);
            });
        }).catch(error => {
            this.logger.error(`Error sending message to topic: ${topic}`, error);
        });
        
        
    }


}