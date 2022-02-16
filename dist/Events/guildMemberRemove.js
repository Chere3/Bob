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
const cacheManager_1 = require("../Util/managers/littleManagers/cacheManager");
const run = (bot, member) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, cacheManager_1.getTestMode)() == true)
        return;
    if (member.guild.id !== "912858763126538281")
        return;
    if (member.user.bot)
        return;
    if (member === null || member === void 0 ? void 0 : member.partial)
        member.fetch().catch(() => { });
    const channel = member.guild.channels.cache.find(x => x.id == "913254279693864960");
    const logs = member.guild.channels.cache.find(x => x.id == "923061304376324096");
    if (!channel)
        return global.prettyConsole.error(`No se pudo encontrar el canal de bienvenida.`);
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        yield logs.messages.fetch();
        const message = logs.messages.cache.map(x => x).find(x => x.content.split(" ")[0] == `exit` && x.content.split(" ")[1] == member.id);
        if (!message)
            return global.prettyConsole.error(`No se pudo encontrar el mensaje de bienvenida.`);
        const args = message.content.split(" ");
        if (message.content.split(" ")[2] == "vanity") {
            channel.send(`> ${member.user.username} salió del servidor, este entró por medio de la invitación personalizada (**${member.guild.vanityURLCode}**), este llevaba en el servidor desde <t:${member.joinedTimestamp.toString().slice(0, -3)}:R>, y se había unido ${args[3]} veces`);
        }
        else if (message.content.split(" ")[1] == member.id) {
            const args = message.content.split(" ");
            const user = member.guild.members.cache.get(args[2]);
            channel.send(`> ${member.user.username} salió del servidor, este entró por medio de la invitación de ${user === null || user === void 0 ? void 0 : user.user.username} (**${args[3]}** personas han entrado con esta invitación, **${args[4].slice(1)}** personas invitadas con esta invitacion han salido del servidor, **${args[5].slice(1)}** vienen de cuentas falsificadas), este llevaba en el servidor desde <t:${member.joinedTimestamp.toString().slice(0, -3)}:R>, y se había unido ${args[6]} veces`);
        }
    }), 6000);
});
exports.run = run;
