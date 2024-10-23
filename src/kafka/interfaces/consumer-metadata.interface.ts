import { IHeaders, KafkaMessage } from "kafkajs";

export interface ConsumerMetadata {
    topic: string;
    partition: number;
    offset: string;
    timestamp: string;
    headers: IHeaders;
    message: KafkaMessage;
}