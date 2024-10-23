export class ProducerEventConfig {
    constructor(
        public readonly topic: string,
        public readonly eventId: string
    ) { }
}