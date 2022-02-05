"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashContext = void 0;
const config_1 = require("../../config");
class SlashContext {
    constructor(temp, interaction) {
        this.interaction = interaction;
        this.options = [];
        this.client = temp;
        this.config = config_1.config;
    }
    get author() {
        return this.interaction.user;
    }
    get channel() {
        return this.interaction.channel;
    }
    get guild() {
        return this.interaction.guild;
    }
}
exports.SlashContext = SlashContext;
