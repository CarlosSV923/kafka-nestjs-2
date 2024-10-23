import { Injectable } from "@nestjs/common";
import { ConsumerHandler } from "../interfaces/consumer-handler.interface";
import { ConsumerMetadata } from "../interfaces/consumer-metadata.interface";
import { ConsumerTest1Type } from "../types/consumerTest1.type";

export const ConsumerTest1ServiceName = 'ConsumerTest1Service';

@Injectable()
export class ConsumerTest1Service implements ConsumerHandler<ConsumerTest1Type> {

    handle(message: string | ConsumerTest1Type, metadata: ConsumerMetadata): void {
        console.log('ConsumerTest1Service', message, metadata);
    }

}