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
const __1 = require("../../..");
const BaseCommand_1 = require("../../../Util/Classes/BaseCommand");
const emojis_1 = require("../../../Util/constants/emojis");
const socialCommandsManager_1 = require("../../../Util/managers/littleManagers/socialCommandsManager");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "addimage",
            aliases: ["addimages"],
            description: "Agrega una imagen a la base de datos",
            dev: true,
        });
    }
    run(base) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (!base.args[0])
                return base.message.reply(`> __**Debes de ingresar el valor al que le quieres agregar la imagen.**__`);
            if (!base.args[1] && !((_a = base.message.attachments.first()) === null || _a === void 0 ? void 0 : _a.proxyURL))
                return base.message.reply(`> __**Debes de ingresar la imagen a agregar.**__`);
            const embed = new discord_js_1.MessageEmbed().setColor(`PURPLE`);
            if ((base.args.slice(1).length + base.message.attachments.size) >= 2) {
                const images = [];
                const attachments = (_b = base.message.attachments) === null || _b === void 0 ? void 0 : _b.map(x => x === null || x === void 0 ? void 0 : x.proxyURL);
                const args = base.args.slice(1).map(x => x);
                const global = [];
                for (let url of attachments) {
                    global.push(url);
                }
                ;
                for (let url of args) {
                    global.push(url);
                }
                ;
                const m1 = yield base.message.reply({ embeds: [embed.setAuthor({ name: `¿Estas seguro que quieres agregar ${global.length} imagenes?` }).setImage(global[0]).setTimestamp()], components: [base.ar(base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "right", false, emojis_1.emojis.right_arrow)), base.ar(base.b("SECONDARY", "yes", "yes", false, emojis_1.emojis.rs_palomita), base.b("SECONDARY", "no", "no", false, emojis_1.emojis.rs_x))] });
                const embeds = [];
                var page = 0;
                for (let i = 0; i < global.length; i++) {
                    embeds.push(new discord_js_1.MessageEmbed().setColor(`PURPLE`).setImage(global[i]).setFooter({ text: `Página ${i + 1} de ${global.length}` }).setAuthor({ name: `¿Estas seguro que quieres agregar estas imagenes?` }));
                }
                const w1 = m1.createMessageComponentCollector({ filter: (a) => a.member.id !== base.message.author.id, componentType: "BUTTON", max: 60, time: 60000 });
                w1.on(`collect`, (a) => __awaiter(this, void 0, void 0, function* () {
                    const aa = a;
                    if (aa.customId == "left") {
                        if (page !== 0) {
                            --page;
                            aa.update({ embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "right", false, emojis_1.emojis.right_arrow)), base.ar(base.b("SECONDARY", "yes", "yes", false, emojis_1.emojis.rs_palomita), base.b("SECONDARY", "no", "no", false, emojis_1.emojis.rs_x))] });
                        }
                        else {
                            page = [embeds.length - 1];
                            aa.update({ embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "right", false, emojis_1.emojis.right_arrow)), base.ar(base.b("SECONDARY", "yes", "yes", false, emojis_1.emojis.rs_palomita), base.b("SECONDARY", "no", "no", false, emojis_1.emojis.rs_x))] });
                        }
                    }
                    else if (aa.customId == "right") {
                        if (page < embeds.length - 1) {
                            page++;
                            aa.update({ embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "right", false, emojis_1.emojis.right_arrow)), base.ar(base.b("SECONDARY", "yes", "yes", false, emojis_1.emojis.rs_palomita), base.b("SECONDARY", "no", "no", false, emojis_1.emojis.rs_x))] });
                        }
                        else {
                            page = 0;
                            aa.update({ embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "right", false, emojis_1.emojis.right_arrow)), base.ar(base.b("SECONDARY", "yes", "yes", false, emojis_1.emojis.rs_palomita), base.b("SECONDARY", "no", "no", false, emojis_1.emojis.rs_x))] });
                        }
                    }
                    else if (aa.customId == "yes") {
                        __1.transaction;
                        try {
                            yield (0, socialCommandsManager_1.addImages)(global, base.args[0]);
                            aa.update({ embeds: [embed.setDescription(`> __**Se han agregado correctamente ${global.length} imagenes a la base de datos.**__`)] });
                        }
                        catch (e) {
                            if (!String(e).startsWith(`Error:`)) {
                                __1.sentry.captureException(e);
                                __1.transaction.finish();
                                return aa.update({ embeds: [embed.setDescription(`> __**${base._INTERNAL_E_TEXT}**__`).setColor("DARK_RED")] });
                            }
                            aa.update({ embeds: [embed.setDescription(`> __**${String(e).slice(6)}**__`)] });
                        }
                    }
                }));
            }
            else if (base.args[1] == "channel") {
                const m1 = yield base.message.reply(`> __**Espera, estoy registrando todas las imagenes en los ultimos 100 mensajes que contiene este canal, esto puede tardar un poco...**__`);
                yield base.channel.messages.fetch({ limit: 100 });
                const images = base.channel.messages.cache.filter(x => x.attachments.size > 0).map(x => x.attachments.map(x => x.proxyURL)).flat().filter(x => x.includes(".png") || x.includes(".jpg") || x.includes(".jpeg") || x.includes(".gif") || x.includes(".webp"));
                const embeds = base.channel.messages.cache.filter(x => x.embeds.length > 0).filter(x => x.embeds.filter(x => x.type == "image") !== undefined).map(x => x.embeds.map(x => x.url)).flat().filter(x => (x === null || x === void 0 ? void 0 : x.includes(".png")) || (x === null || x === void 0 ? void 0 : x.includes(".jpg")) || (x === null || x === void 0 ? void 0 : x.includes(".jpeg")) || (x === null || x === void 0 ? void 0 : x.includes(".gif")) || (x === null || x === void 0 ? void 0 : x.includes(".webp")));
                const global = [...images, ...embeds];
                const embed = new discord_js_1.MessageEmbed().setAuthor(`¿Deseas agregar ${global.length} imagenes a la base de datos?`).setColor(`PURPLE`).setFooter({ text: `Página 1 de ${global.length}` }).setImage(global[0]);
                const m2 = yield m1.edit({ content: `.`, embeds: [embed], components: [base.ar(base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "right", false, emojis_1.emojis.right_arrow)), base.ar(base.b("SECONDARY", "yes", "yes", false, emojis_1.emojis.rs_palomita), base.b("SECONDARY", "no", "no", false, emojis_1.emojis.rs_x))] });
                const embedss = [];
                var page = 0;
                for (let i = 0; i < global.length; i++) {
                    embedss.push(new discord_js_1.MessageEmbed().setAuthor({ name: `¿Deseas agregar ${global.length} imagenes a la base de datos?` }).setColor(`PURPLE`).setFooter({ text: `Página ${i + 1} de ${global.length}` }).setImage(global[i]));
                }
                const w1 = m2.createMessageComponentCollector({ componentType: "BUTTON", time: 60000, filter: (a) => a.member.id == base.message.author.id });
                w1.on("collect", (aa) => __awaiter(this, void 0, void 0, function* () {
                    if (aa.customId == "left") {
                        if (page > 0) {
                            page--;
                            aa.update({ embeds: [embedss[page]], components: [base.ar(base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "right", false, emojis_1.emojis.right_arrow)), base.ar(base.b("SECONDARY", "yes", "yes", false, emojis_1.emojis.rs_palomita), base.b("SECONDARY", "no", "no", false, emojis_1.emojis.rs_x))] });
                        }
                        else {
                            page = global.length - 1;
                            aa.update({ embeds: [embedss[page]], components: [base.ar(base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "right", false, emojis_1.emojis.right_arrow)), base.ar(base.b("SECONDARY", "yes", "yes", false, emojis_1.emojis.rs_palomita), base.b("SECONDARY", "no", "no", false, emojis_1.emojis.rs_x))] });
                        }
                    }
                    else if (aa.customId == "right") {
                        if (page < global.length - 1) {
                            page++;
                            aa.update({ embeds: [embedss[page]], components: [base.ar(base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "right", false, emojis_1.emojis.right_arrow)), base.ar(base.b("SECONDARY", "yes", "yes", false, emojis_1.emojis.rs_palomita), base.b("SECONDARY", "no", "no", false, emojis_1.emojis.rs_x))] });
                        }
                        else {
                            page = 0;
                            aa.update({ embeds: [embedss[page]], components: [base.ar(base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "right", false, emojis_1.emojis.right_arrow)), base.ar(base.b("SECONDARY", "yes", "yes", false, emojis_1.emojis.rs_palomita), base.b("SECONDARY", "no", "no", false, emojis_1.emojis.rs_x))] });
                        }
                    }
                    else if (aa.customId == "yes") {
                        __1.transaction;
                        try {
                            yield (0, socialCommandsManager_1.addImages)(global, base.args[0]);
                            aa.update({ embeds: [embed.setDescription(`> __**Agregadas ${global.length} imagenes a la base de datos correctamente.**__`)] });
                        }
                        catch (e) {
                            if (!String(e).startsWith(`Error:`)) {
                                __1.sentry.captureException(e);
                                aa.update({ embeds: [embed.setColor(`DARK_RED`).setDescription(`> __**${base._INTERNAL_E_TEXT}**__`)] });
                                __1.transaction.finish();
                            }
                            aa.update({ embeds: [embed.setDescription(`> __**${String(e).slice(6)}**__`)] });
                        }
                    }
                    else if (aa.customId == "no") {
                        aa.update({ embeds: [embed.setDescription(`> __**Cancelado**__`).setImage(null).setAuthor(null).setFooter(null)] });
                    }
                }));
            }
            else {
                if (!base.args[0])
                    return base.message.reply(`> __**Debes de especificar la categoría a la que quieres que la imagen se agregue.**__`);
                if (!base.args[1] && !base.message.attachments.first())
                    return base.message.reply(`> __**Debes de especificar la imagen que quieres agregar.**__`);
                const image = (_c = base === null || base === void 0 ? void 0 : base.args[1]) !== null && _c !== void 0 ? _c : (_d = base.message.attachments.first()) === null || _d === void 0 ? void 0 : _d.proxyURL;
                const embed = new discord_js_1.MessageEmbed().setAuthor({ name: `¿Deseas agregar esta imagen a la base de datos?` }).setColor(`PURPLE`).setImage(base.args[1]);
                const m1 = yield base.message.reply({ embeds: [embed], components: [base.ar(base.b("SECONDARY", "yes", "yes", false, emojis_1.emojis.rs_palomita), base.b("SECONDARY", "no", "no", false, emojis_1.emojis.rs_x))] });
                const m2 = yield m1.createMessageComponentCollector({ componentType: "BUTTON", time: 60000, filter: (a) => a.member.id == base.message.author.id });
                m2.on("collect", (aa) => __awaiter(this, void 0, void 0, function* () {
                    if (aa.customId == "yes") {
                        __1.transaction;
                        try {
                            yield (0, socialCommandsManager_1.addImage)(base.args[1], base.args[0]);
                            aa.update({ embeds: [embed.setDescription(`> __**Agregada la imagen correctamente.**__`)] });
                        }
                        catch (e) {
                            if (!String(e).startsWith(`Error:`)) {
                                __1.sentry.captureException(e);
                                aa.update({ embeds: [embed.setColor(`DARK_RED`).setDescription(`> __**${base._INTERNAL_E_TEXT}**__`)] });
                                __1.transaction.finish();
                            }
                            aa.update({ embeds: [embed.setDescription(`> __**${String(e).slice(6)}**__`)] });
                        }
                    }
                    else if (aa.customId == "no") {
                        aa.update({ embeds: [embed.setDescription(`> __**Cancelado**__`).setImage(null).setAuthor(null).setFooter(null)] });
                    }
                }));
            }
        });
    }
}
exports.default = NameCommand;
