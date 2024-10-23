import { Consumer, Producer } from "kafkajs";
import { ConsumerHandlerConfig } from "./consumer-handler.config";
import { ProducerEventConfig } from "./producer-event.config";

export const KAFKA_CLIENT_CONFIG = 'KAFKA_CLIENT_CONFIG';

export class KafkaClientConfig {
    constructor(
        public readonly producer: Producer,
        public readonly consumer: Consumer,
        public readonly handlers: ConsumerHandlerConfig[],
        public readonly events: ProducerEventConfig[],
        public readonly fromBeginning: boolean
    ) {}
}