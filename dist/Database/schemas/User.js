"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    registeredAt: { type: String, required: true, default: Date.now() },
    warns: { type: Number, required: true, default: 0 },
    mutes: { type: Number, required: true, default: 0 },
    kicks: { type: Number, required: true, default: 0 },
    bans: { type: Number, required: true, default: 0 },
    warnsHistory: { type: Array, required: true, default: [] },
    mutesHistory: { type: Array, required: true, default: [] },
    modLogs: { type: Array, required: true, default: [] },
    social: {
        hugs: { type: Number, required: true, default: 0 },
        kisses: { type: Number, required: true, default: 0 },
        pats: { type: Number, required: true, default: 0 },
        happy: { type: Number, required: true, default: 0 },
        sad: { type: Number, required: true, default: 0 },
        angry: { type: Number, required: true, default: 0 },
        love: { type: Number, required: true, default: 0 },
        hate: { type: Number, required: true, default: 0 },
        confused: { type: Number, required: true, default: 0 },
        bored: { type: Number, required: true, default: 0 },
        scared: { type: Number, required: true, default: 0 },
        fucks: { type: Number, required: true, default: 0 },
        licks: { type: Number, required: true, default: 0 },
        sucks: { type: Number, required: true, default: 0 },
    },
});
exports.userModel = (0, mongoose_1.model)("Usuarios", exports.userSchema);
