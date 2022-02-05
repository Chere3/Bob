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
exports.updateListWithNewBan = exports.formatBans = void 0;
function formatBans(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const array = [];
        const bans = yield message.guild.bans.fetch();
        for (let i = 0; i < bans.size; i += 15) {
            const temp = [];
            for (let j = i; j < i + 15; j++) {
                if (j < bans.size) {
                    temp.push(`${bans.map(x => x)[j].user.id} - ${bans.map(x => x)[j].reason}`);
                }
            }
            array.push(temp);
        }
        return array;
    });
}
exports.formatBans = formatBans;
function updateListWithNewBan(ban) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield (yield ban.guild.channels.cache.find(x => x.name === 'bans'));
        const messages = yield channel.messages.cache.filter(x => x.embeds.length > 0 && x.embeds[0].author.name.includes('Lista de baneos'));
        const listMessages = yield messages.map((x) => __awaiter(this, void 0, void 0, function* () {
            const bans = x.embeds[0].description.match(/\d{18}/g);
            if (bans !== null && bans.length > 15) {
                return yield x.edit(`a`);
            }
        }));
    });
}
exports.updateListWithNewBan = updateListWithNewBan;
