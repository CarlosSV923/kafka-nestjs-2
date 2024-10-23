import { CompressionTypes, IHeaders } from "kafkajs";

export interface ProducerEvent {
    message: any;
    acks?: number;
    timeout?: number;
    compression?: CompressionTypes;
    key?: string;
    partition?: number
    headers?: IHeaders
    timestamp?: string
}