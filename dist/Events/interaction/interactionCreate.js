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
const discord_js_1 = require("discord.js");
const cacheManager_1 = require("../../Util/managers/littleManagers/cacheManager");
const run = (client, Interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, cacheManager_1.getTestMode)() == true)
        return;
    if (Interaction.isButton() == true) {
        const ww = Interaction;
        const button = new discord_js_1.MessageButton()
            .setLabel("No")
            .setStyle("DANGER")
            .setCustomId("no");
        const components = new discord_js_1.MessageActionRow().addComponents(button);
        if (ww.customId == "spam_close") {
            const m1 = yield ww.reply({
                content: `¿En serio no quieres verlo? 😭`,
                components: [components],
                ephemeral: true,
            });
        }
        else if (ww.customId == "no") {
            const boton = button
                .setLabel(`No valoro el trabajo de los demás.`)
                .setCustomId(`BAD`);
            ww.reply({
                ephemeral: true,
                content: `¿Sabías que fueron más de 500 líneas de codigo para eso?`,
                components: [new discord_js_1.MessageActionRow().addComponents(boton)],
            });
        }
        else if (ww.customId == "BAD") {
            console.log(`${ww.member.user.tag} no valora el trabajo de los demás.`);
            yield ww.reply({
                content: `Bueno bueno 😭😭😭😭🙄🙄, ya te cerré el mensaje 😭`,
                ephemeral: true,
            });
            yield (yield ww.channel.messages.fetch())
                .filter((x) => { var _a, _b; return ((_b = (_a = x.embeds[0]) === null || _a === void 0 ? void 0 : _a.author) === null || _b === void 0 ? void 0 : _b.name) == "¡Pruebame!"; })
                .map((x) => x.delete());
        }
    }
});
exports.run = run;
