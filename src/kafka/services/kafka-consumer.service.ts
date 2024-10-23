import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { KAFKA_CLIENT_CONFIG, KafkaClientConfig } from "../configuration/kafkaClient.config";
import { DiscoveryService } from "@nestjs/core";
import { ConsumerHandler } from "../interfaces/consumer-handler.interface";
import { Consumer } from "kafkajs";

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {

    private readonly logger = new Logger(KafkaConsumerService.name);
    private readonly consumerInstance: Consumer;
    private readonly consumersTopicMap = new Map<string, ConsumerHandler<unknown>[]>();

    constructor(
        @Inject(KAFKA_CLIENT_CONFIG)
        private readonly kafkaClientConfig: KafkaClientConfig,
        private readonly discoveryService: DiscoveryService,
    ) {
        this.consumerInstance = this.kafkaClientConfig.consumer;
    }


    async onModuleDestroy(): Promise<void> {

        try {
            await this.consumerInstance.disconnect();
            this.logger.log('Successfully disconnected from Kafka broker for consuming messages');
        } catch (error) {
            this.logger.error('Error disconnecting from Kafka broker', error);
        }
    }

    async onModuleInit(): Promise<void> {
        await this.connectToKafka();
        this.getConsumersInstances();
        await this.subscribeToTopics();
        await this.runHandlersConsumer();
    }

    private async connectToKafka(): Promise<void> {

        try {
            await this.consumerInstance.connect();
            this.logger.log('Successfully connected to Kafka broker for consuming messages');
        } catch (error) {
            this.logger.error('Error connecting to Kafka broker', error);
        }
    }

    private getConsumersInstances(): void {
        const { handlers } = this.kafkaClientConfig;
        const instances = this.discoveryService.getProviders();

        handlers.forEach(handler => {
            const instanceWrapper = instances.find(i => i.token === handler.consumerHandlerId);
            if (instanceWrapper?.instance) {
                const consumerHandler = instanceWrapper.instance as ConsumerHandler<unknown>;
                if (!this.consumersTopicMap.has(handler.topic)) {
                    this.consumersTopicMap.set(handler.topic, [consumerHandler]);
                }
                else {
                    this.consumersTopicMap.get(handler.topic).push(consumerHandler);
                }
            }
        });
    }

    private async subscribeToTopics(): Promise<void> {
        const { fromBeginning } = this.kafkaClientConfig;
        const topics = Array.from(this.consumersTopicMap.keys());

        try {
            await this.consumerInstance.subscribe({ topics, fromBeginning })
            this.logger.log('Successfully subscribed to topics', topics);
        } catch (error) {
            this.logger.error('Error subscribing to topics', error);
        }
    }

    private parseMessage(message: string): unknown {
        try {
            return JSON.parse(message);
        } catch (error) {
            return message;
        }
    }

    private async runHandlersConsumer(): Promise<void> {

        try {

            await this.consumerInstance.run({
                eachMessage: async ({ message, partition, topic }) => {
                    const handlers = this.consumersTopicMap.get(topic) || [];
                    handlers.forEach(handler => {
                        try {
                            handler.handle(
                                this.parseMessage(message.value.toString()),
                                {
                                    topic,
                                    partition,
                                    offset: message.offset,
                                    timestamp: message.timestamp,
                                    headers: message.headers,
                                    message,
                                }
                            );
                        } catch (error) {
                            this.logger.error(`Error processing message from topic ${topic}`, error);
                        }
                    });
                }
            });

        } catch (error) {
            this.logger.error('Error running consumer handlers', error);
        }

    }

}