import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";

export function spammer(message: Message) {
  if (message.author.bot) return;

  const embed = new MessageEmbed()
    .setAuthor(`¡Pruebame!`)
    .setDescription(
      `Ahora puedes **usar un mejor bot**, ¿recuerdas un bot llamado *utilities* que contaba las **acciones que haces?** pues este bot ha vuelto de forma mejorada.\n\nSolo pon:\n\`!hug\`\n\`!kiss\`\n\`!pat\``
    )
    .setColor("ORANGE");

  const component = new MessageButton()
    .setLabel(`Cerrar mensaje`)
    .setStyle("DANGER")
    .setCustomId(`spam_close`);
  const row = new MessageActionRow().addComponents(component);
  if (
    message.content.toLowerCase().startsWith("d!hug") ||
    message.content.toLowerCase().startsWith("d!kiss") ||
    message.content.toLowerCase().startsWith("d!pat") ||
    message.content.toLowerCase().startsWith("furhug") ||
    message.content.toLowerCase().startsWith("furkiss") ||
    message.content.toLowerCase().startsWith("furpat") ||
    message.content.toLowerCase().startsWith("furhug")
  )
    return message.reply({
      embeds: [embed],
      components: [row],
    });
}
