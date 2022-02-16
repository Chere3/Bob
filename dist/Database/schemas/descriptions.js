"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.descriptionsModel = exports.descriptionsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.descriptionsSchema = new mongoose_1.Schema({
    id: { type: String, required: true, default: "first" },
    hug: { type: Array, required: true, default: [] },
    kiss: { type: Array, required: true, default: [] },
    pats: { type: Array, required: true, default: [] },
    happy: { type: Array, required: true, default: [] },
    sad: { type: Array, required: true, default: [] },
    angry: { type: Array, required: true, default: [] },
    love: { type: Array, required: true, default: [] },
    hate: { type: Array, required: true, default: [] },
    confused: { type: Array, required: true, default: [] },
    bored: { type: Array, required: true, default: [] },
    scared: { type: Array, required: true, default: [] },
    fucks: { type: Array, required: true, default: [] },
    licks: { type: Array, required: true, default: [] },
    sucks: { type: Array, required: true, default: [] },
});
exports.descriptionsModel = (0, mongoose_1.model)("descriptions", exports.descriptionsSchema);
