import { Producer, Consumer } from "kafkajs";
declare class Redpanda {
    private _producer;
    private _consumer;
    connect: (groupId: string) => Promise<readonly [Producer, Consumer]>;
    get producer(): Producer;
    get consumer(): Consumer;
}
export declare const redpanda: Redpanda;
export {};
