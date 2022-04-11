import { Client, ColorResolvable, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js"
import emojis from "../../../assets/emojis";
/**
 * The main class to control the ping and status of the bot.
 */

export class PingAndStatus {
    debug: string


    /**
     * The debug message of the bot to work.
     */

    constructor(debugMessage: string) {
        this.debug = debugMessage
    }

    /**`
     * The debug message to be edited on the bot.
     */

    async editDebugMessage(client: Client) {
        const channel = client.channels.cache.get("962400618868273192") as TextChannel; const message = await channel.messages.fetch(`963099563231674439`);

        const embed = new MessageEmbed().setAuthor({name: `Estado del bot`}).setDescription(`\`\`\`yml\n${this.debug}\`\`\`\n**__Ping:__** ${client.ws.ping}`).setColor(`PURPLE`).setTimestamp()
        const button = new MessageButton().setStyle(`PRIMARY`).setLabel(`Reiniciar`).setEmoji(emojis.rs_reset).setCustomId(`reset_bot`); const button1 = new MessageButton().setStyle(`DANGER`).setLabel(`Apagar`).setEmoji(`❌`).setCustomId(`shutdown_bot`); const button2 = new MessageButton().setStyle(`DANGER`).setLabel(`Cerrar proceso`).setEmoji(`❤️‍🔥`).setCustomId(`process_kill`)

        message.edit({embeds: [embed], components: [new MessageActionRow().setComponents(button, button1, button2)]})
    }
}