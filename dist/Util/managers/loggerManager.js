"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderationBotLogs = void 0;
const discord_js_1 = require("discord.js");
class moderationBotLogs {
    constructor(member, moderator, reason, caseNumber, time) {
        this.member = member;
        this.moderator = moderator;
        this.reason = reason;
        this.case = caseNumber;
        this.time = time;
    }
    logWarn() {
        const channel = this.member.guild.channels.cache.find(c => c.name === "cheree_tests");
        const embed = new discord_js_1.MessageEmbed().setAuthor(`${this.moderator.nickname || this.moderator.user.username}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, this.moderator.displayAvatarURL() || this.moderator.user.displayAvatarURL()).setColor(`PURPLE`).setDescription(`❌ **Ha warneado a:** \`${this.member.user.tag}\` ( ${this.member.id} )\n🎲 **Razon:**: ${this.reason || "Sin razón."}\n 🔩 **ID de caso:**\n \`\`\`${this.case}\`\`\``).setTimestamp().setThumbnail(this.member.displayAvatarURL() || this.member.user.displayAvatarURL());
        this.sendPrivateMessage();
        return channel.send({ embeds: [embed] });
    }
    sendPrivateMessage() {
        const text = `**Has sido advertido en ${this.member.guild.name}**\n🎲 **Razón:** ${this.reason}\n 🔩 **ID de caso:** \`${this.case}\``;
        return this.member.send(text).catch(() => { });
    }
}
exports.moderationBotLogs = moderationBotLogs;
