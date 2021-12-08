import { ButtonInteraction, Client, Interaction } from "discord.js";

export const run = (client: Client, Interaction: Interaction) => {
  if (Interaction.isButton() == true) {
    const ww = Interaction as ButtonInteraction;

    if (ww.customId == "spam_close") {
      ww.channel.messages.fetch().then((messages) => {
        messages.forEach((message) => {
          ww.reply({
            content: "¡Gracias por ayudarnos a mejorar! :smile:",
            ephemeral: true,
          });
          if (
            message.content.startsWith(
              "¿Sí sabías que ahora puedes usar comandos sociales más avanzados y que tú puedes subir tus propias imagenes?"
            )
          ) {
            message.delete();
          }
        });
      });
    }
  }
};
