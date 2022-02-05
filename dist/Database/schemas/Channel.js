"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelModel = exports.channelSchema = void 0;
const mongoose_1 = require("mongoose");
exports.channelSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    registeredAt: { type: String, required: true, default: Date.now() },
    snipes: { type: Array, required: true, default: [] },
    editsnipes: { type: Array, required: true, default: [] }
});
exports.channelModel = (0, mongoose_1.model)("Canales", exports.channelSchema);
