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
exports.TempContext = void 0;
const config_1 = require("../../config");
const discord_js_1 = require("discord.js");
const moderationManager_1 = require("../managers/moderationManager");
class TempContext {
    constructor(Temp, message) {
        this.message = message;
        this.client = Temp;
        this.config = config_1.config;
        this.args = [];
        this.flags = [];
    }
    get channel() {
        return this.message.channel;
    }
    get guild() {
        return this.message.guild;
    }
    get user() {
        return this.message.author;
    }
    get member() {
        return this.message.member;
    }
    get db() {
        const a = new moderationManager_1.moderationUtil().childRandom();
        return this.b("SECONDARY", "ㅤ", a, true);
    }
    get _INTERNAL_E_TEXT() {
        return `Mis sistemas han detectado un error interno en mi codigo, este ha sido notificado a mi desarrollador, por favor espera algun tiempo a que el error sea solucionado.`;
    }
    l(content, link, disabled = false) {
        const button = new discord_js_1.MessageButton()
            .setStyle(`LINK`)
            .setLabel(content)
            .setURL(`${link}`)
            .setDisabled(disabled);
        return button;
    }
    b(type, content, id = "a", desactivated = false, emoji) {
        if (!emoji) {
            const button = new discord_js_1.MessageButton()
                .setStyle(type)
                .setLabel(content)
                .setCustomId(id)
                .setDisabled(desactivated);
            return button;
        }
        else {
            const button = new discord_js_1.MessageButton()
                .setStyle(type)
                .setCustomId(id)
                .setDisabled(desactivated)
                .setEmoji(emoji);
            return button;
        }
    }
    ar(component1, component2, component3, component4, component5, component6, component7, component8, component9, component10) {
        const ar = new discord_js_1.MessageActionRow();
        if (!component1) {
            throw new Error("You must provide at least one component");
        }
        else {
            if (component2) {
                if (component3) {
                    if (component4) {
                        if (component5) {
                            if (component6) {
                                if (component7) {
                                    if (component8) {
                                        if (component9) {
                                            if (component10) {
                                            }
                                            else {
                                                ar.addComponents(component1, component2, component3, component4, component5, component6, component7, component8, component9);
                                            }
                                        }
                                        else {
                                            ar.addComponents(component1, component2, component3, component4, component5, component6, component7, component8);
                                        }
                                    }
                                    else {
                                        ar.addComponents(component1, component2, component3, component4, component5, component6, component7);
                                    }
                                }
                                else {
                                    ar.addComponents(component1, component2, component3, component4, component5, component6);
                                }
                            }
                            else {
                                ar.addComponents(component1, component2, component3, component4, component5);
                            }
                        }
                        else {
                            ar.addComponents(component1, component2, component3, component4);
                        }
                    }
                    else {
                        ar.addComponents(component1, component2, component3);
                    }
                }
                else {
                    ar.addComponents(component1, component2);
                }
            }
            else {
                ar.addComponents(component1);
            }
        }
        return ar;
    }
    send(content, adds) {
        return this.channel.send(content).catch((e) => {
            console.log(e);
        });
    }
    Getmember(id) {
        if (!this.guild.members.cache.get(id) == false) {
            return this.guild.members.cache.get(id);
        }
        else {
            return this.client.users.cache.get(id);
        }
    }
    name(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.guild.members.cache.get(id) == false) {
                return this.guild.members.cache.get(id).nickname || this.guild.members.cache.get(id).user.username;
            }
            else {
                return yield (yield this.client.users.fetch(id)).username;
            }
        });
    }
    avatar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.guild.members.cache.get(id) == false) {
                return this.guild.members.cache.get(id).displayAvatarURL() || this.guild.members.cache.get(id).user.displayAvatarURL();
            }
            else {
                return yield (yield this.client.users.fetch(id)).displayAvatarURL();
            }
        });
    }
}
exports.TempContext = TempContext;
