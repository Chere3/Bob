import { Message, MessageActionRow, MessageButton } from "discord.js";

export function spammer(message: Message) {
  if (message.author.bot) return;
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
      content: `¿Sí sabías que ahora puedes usar comandos sociales más avanzados y que tú puedes subir tus propias imagenes?\nSolo pon \`!hug\` o \`!kiss\` o \`!pat\` y el nombre del usuario que quieres que te haga ese comando.`,
      components: [row],
    });
}
