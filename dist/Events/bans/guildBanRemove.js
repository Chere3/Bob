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
const loggerManager_1 = require("../../Util/managers/loggerManager");
const run = (client, ban) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield client.cache;
    const find = data.bans.find(b => b.id === ban.user.id);
    if (find) {
        ban.guild.members.ban(ban.user.id, { reason: 'Automoderador: Solo yo puedo desbanear a las personas que son baneadas por mí.' });
        yield new loggerManager_1.moderationBotLogs(null, client.guilds.cache.get(`912858763126538281`).me, `Automoderador: Yo solo puedo desbanear a las personas que yo mismo baneo.`, `0`).sendBanLog(ban.user);
    }
    else {
        return;
    }
});
exports.run = run;
