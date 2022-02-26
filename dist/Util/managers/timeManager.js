"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeEventCore = void 0;
function timeEventCore(client) {
    client.emit("_10seconds", Date.now());
    client.emit("_10minutes", Date.now());
    client.emit("_30seconds", Date.now());
    setInterval(() => {
        client.emit("_10seconds", Date.now());
    }, 10000);
    setInterval(() => {
        client.emit("_10minutes", Date.now());
    }, 600000);
    setInterval(() => {
        client.emit("_30seconds", Date.now());
    }, 30000);
}
exports.timeEventCore = timeEventCore;
