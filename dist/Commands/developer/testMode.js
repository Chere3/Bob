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
const discord_js_1 = require("discord.js");
const BaseCommand_1 = require("../../Util/Classes/BaseCommand");
const index_1 = require("../../index");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "testmode",
            dev: true,
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new discord_js_1.MessageEmbed().setAuthor(`Modo canary.`).setDescription(`Activar este modo desactiva muchas de las funciones centrales del bot y cambia el prefix a \`!!\``).setColor("PURPLE");
            const m1 = yield base.message.reply({ embeds: [embed], components: [base.ar(base.b("PRIMARY", "Activar", "a"), base.b("SECONDARY", "Desactivar", "b"))] });
            const aw1 = m1.createMessageComponentCollector({ componentType: "BUTTON", filter: b => b.member.id == base.message.author.id });
            aw1.on("collect", a => {
                a = a;
                if (a.customId == "a") {
                    index_1.db.push("/", { test: true });
                    base.message.reply("Modo canary activado.");
                }
                else if (a.customId == "b") {
                    index_1.db.push("/", { test: false });
                    base.message.reply("Modo canary desactivado.");
                }
            });
        });
    }
}
exports.default = NameCommand;
