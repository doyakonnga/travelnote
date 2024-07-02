"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redpanda = void 0;
const kafkajs_1 = require("kafkajs");
const redpandaConfig = new kafkajs_1.Kafka({
    brokers: [process.env.REDPANDA_BROKER],
    connectionTimeout: 200000,
    ssl: {},
    sasl: {
        mechanism: "scram-sha-256",
        username: process.env.REDPANDA_USERNAME,
        password: process.env.REDPANDA_PASSWORD
    }
});
class Redpanda {
    constructor() {
        this._producer = null;
        this._consumer = null;
        this.connect = (groupId) => __awaiter(this, void 0, void 0, function* () {
            this._producer = redpandaConfig.producer();
            this._consumer = redpandaConfig.consumer({ groupId });
            yield this._producer.connect();
            yield this._consumer.connect();
            return [this._producer, this._consumer];
        });
    }
    get producer() {
        if (!this._producer)
            throw new Error('not connected to redpanda');
        return this._producer;
    }
    get consumer() {
        if (!this._consumer)
            throw new Error('not connected to redpanda');
        return this._consumer;
    }
}
exports.redpanda = new Redpanda;
