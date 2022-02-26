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
exports.run = void 0;
const moderationManager_1 = require("../../Util/managers/moderationManager");
const run = (Bot, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    yield new moderationManager_1.warnManager(null, Bot.guilds.cache.get(`912858763126538281`).me, null, true).automaticWarnDelete();
});
exports.run = run;
