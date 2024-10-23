import { ConsumerMetadata } from "./consumer-metadata.interface";

export interface ConsumerHandler<T extends {
    [key: string]: any;
}> {
    handle(message: T | string, metadata: ConsumerMetadata): void;
}