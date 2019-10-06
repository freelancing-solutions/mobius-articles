"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
class Channel extends events_1.default {
    constructor(connections = [], data = null) {
        super();
        this.connections = connections;
        this.data = data;
    }
    get length() {
        return this.connections.length;
    }
    leave(...connections) {
        connections.forEach(current => {
            if (typeof current === 'function') {
                const callback = current;
                this.leave(...this.connections.filter(callback));
            }
            else {
                const index = this.connections.indexOf(current);
                if (index !== -1) {
                    this.connections.splice(index, 1);
                }
            }
        });
        if (this.length === 0) {
            this.emit('empty');
        }
        return this;
    }
    join(...connections) {
        connections.forEach(connection => {
            if (this.connections.indexOf(connection) === -1) {
                this.connections.push(connection);
            }
        });
        return this;
    }
    filter(fn) {
        return new Channel(this.connections.filter(fn), this.data);
    }
    send(data) {
        return new Channel(this.connections, data);
    }
}
exports.Channel = Channel;
//# sourceMappingURL=base.js.map