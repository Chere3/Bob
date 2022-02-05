"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSlashCommand = void 0;
const config_1 = require("../../config");
class BaseSlashCommand {
    constructor(client, options) {
        this.bot = client;
        this.name = options.name;
        this.type = options.type;
        this.description = options.description;
        this.dev = options.dev || false;
        this.nsfw = options.nsfw || false;
        this.cooldown = options.cooldown || 2;
        this.options = options.options;
    }
    go(int) {
        const interaction = int;
        if (this.dev === true) {
            if (config_1.config.owners.find((id) => id === interaction.member.id) !== undefined) {
                return interaction.reply({
                    content: "Este comando es exclusivo para desarrolladores del bot; y tú no eres uno de ellos.",
                    ephemeral: true,
                });
            }
            else if (this.nsfw === true) {
                if (interaction.channel.nsfw == false) {
                    return interaction.reply({
                        content: "Este comando solo puede ser usado en canales NSFW.",
                        ephemeral: true,
                    });
                }
                else if (this.checkCooldown(int)) {
                    const now = Date.now();
                    const time = this.cooldowns.get(interaction.member.id);
                    const timeLeft = (time - now) / 1000;
                    return interaction.reply({
                        content: `Este comando está en cooldown, espera ${timeLeft.toFixed(1)}`,
                        ephemeral: true,
                    });
                }
            }
        }
        return false;
    }
    checkCooldown(int) {
        const intt = int;
        if (this.cooldowns.has(intt.member.id)) {
            const cooldown = this.cooldowns.get(intt.member.id);
            const time = Date.now() - cooldown;
            if (time > this.cooldown) {
                this.cooldowns.set(intt.member.id, Date.now());
                return true;
            }
            else {
                return false;
            }
        }
    }
}
exports.BaseSlashCommand = BaseSlashCommand;
