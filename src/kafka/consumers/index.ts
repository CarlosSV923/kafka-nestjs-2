import { ConsumerTest1Service, ConsumerTest1ServiceName } from "./consumerTest1";

export const consumers = [
    {
        provide: ConsumerTest1ServiceName,
        useClass: ConsumerTest1Service
    }
];