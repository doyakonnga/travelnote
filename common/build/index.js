"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
exports.Publisher = exports.Listener = void 0;
exports.kafkaListen = kafkaListen;
class Listener {
    constructor(consumer) {
        this.consumer = consumer;
    }
    subscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.consumer.subscribe({
                topic: this.topic,
                fromBeginning: true
            });
        });
    }
}
exports.Listener = Listener;
class Publisher {
    constructor(producer) {
        this.producer = producer;
    }
    send(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.send({
                topic: this.topic,
                messages: [{ key, value: JSON.stringify(value) }]
            });
        });
    }
}
exports.Publisher = Publisher;
// & { [K in keyof typeof Listener]: typeof Listener[K] }
// https://stackoverflow.com/questions/67558444/typescript-type-of-subclasses-of-an-abstract-generic-class
function kafkaListen(consumer, ...Listeners) {
    return __awaiter(this, void 0, void 0, function* () {
        // subscribe
        // const listeners: (InstanceType<ExtendedListener>)[] = []
        const listeners = Listeners.map(L => new L(consumer));
        yield Promise.all(listeners.map(l => l.subscribe()));
        // run
        yield consumer.run({
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                // throw new Error('test');
                const listener = listeners.find((l) => topic === l['topic']);
                if (listener) {
                    const value = JSON.parse(message.value);
                    const { offset } = message;
                    const commit = () => __awaiter(this, void 0, void 0, function* () {
                        yield consumer.commitOffsets([{
                                topic,
                                partition,
                                offset: (Number(message.offset) + 1).toString()
                            }]);
                    });
                    yield listener.onMessage({ value, offset, commit });
                }
            })
        });
    });
}
__exportStar(require("./middlewares"), exports);
__exportStar(require("./events"), exports);
__exportStar(require("./redpanda"), exports);
