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
const run = (client, oldMember, newMember) => __awaiter(void 0, void 0, void 0, function* () {
    if (newMember.joinedTimestamp - Date.now() < 60000 && !newMember.roles.cache.has(`913124108512931861`))
        return;
    const cache = client.cache;
    const a = cache.muted.find(x => x.userID == newMember.id);
    if (a == undefined)
        return;
    if (a.ExitedPeriod == true)
        return;
    if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        const newRole = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id)).first();
        if (newRole) {
            if (newRole.id == "913124108512931861")
                return;
            newMember.roles.remove(newRole.id);
            if (!newMember.roles.cache.has(`913124108512931861`)) {
                newMember.roles.add(`913124108512931861`);
            }
        }
    }
    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        const oldRole = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id)).first();
        if (oldRole) {
            if (oldRole.name == "Silenciado")
                newMember.roles.add(oldRole.id);
        }
    }
});
exports.run = run;
