import { Consumer, Producer } from "kafkajs";
import { Topics, Event } from "./events";
export declare abstract class Listener<E extends Event> {
    protected consumer: Consumer;
    abstract topic: E["topic"];
    abstract onMessage(props: {
        value: E["value"];
        offset: string;
        commit: () => Promise<void>;
    }): void;
    constructor(consumer: Consumer);
    subscribe(): Promise<void>;
}
export declare abstract class Publisher<E extends Event> {
    protected producer: Producer;
    abstract topic: Topics;
    constructor(producer: Producer);
    send(key: string, value: E["value"]): Promise<void>;
}
type ExtendedListener = (new (c: Consumer) => Listener<Event>);
export declare function kafkaListen(consumer: Consumer, ...Listeners: ExtendedListener[]): Promise<void>;
export * from './middlewares';
export * from './events';
export * from './redpanda';
