"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historialModel = exports.historialSchema = void 0;
const mongoose_1 = require("mongoose");
exports.historialSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    warns: { type: Array, required: true, default: [] },
    kicks: { type: Array, required: true, default: [] },
    bans: { type: Array, required: true, default: [] },
    mutes: { type: Array, required: true, default: [] },
    unmutes: { type: Array, required: true, default: [] }
});
exports.historialModel = (0, mongoose_1.model)("historial", exports.historialSchema);
