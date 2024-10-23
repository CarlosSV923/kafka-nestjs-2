import { ConsumerHandlerConfig } from "../configuration/consumer-handler.config";

export class ConsumerHandlerBuilder {

    private _topic: string;
    private _consumerHandlerId: string;

    withTopic(topic: string): this {
        this._topic = topic;
        return this;
    }

    withHandler(
        consumerHandlerId: string,
    ): this {
        this._consumerHandlerId = consumerHandlerId;
        return this;
    }

    build(): ConsumerHandlerConfig {
        return new ConsumerHandlerConfig(
            this._topic,
            this._consumerHandlerId
        );
    }

}