export class ConsumerHandlerConfig {
    constructor(
        public readonly topic: string,
        public readonly consumerHandlerId: string
    ) { }
}