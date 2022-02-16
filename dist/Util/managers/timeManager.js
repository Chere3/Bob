"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeEventCore = void 0;
function timeEventCore(client) {
    setInterval(() => {
        client.emit("time", Date.now());
    }, 10000);
}
exports.timeEventCore = timeEventCore;
