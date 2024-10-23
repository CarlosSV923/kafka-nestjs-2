import { ProducerEventConfig } from "../configuration/producer-event.config";

export class ProducerEventBuilder {
    
    private _topic: string;

    private _eventId: string;

    withTopic(topic: string): this {
        this._topic = topic;
        return this;
    }

    withEventId(eventId: string): this {
        this._eventId = eventId;
        return this;
    }

    build(): ProducerEventConfig {
        return new ProducerEventConfig(
            this._topic,
            this._eventId
        );
    }

    
}