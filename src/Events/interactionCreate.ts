import { MessageActionRow, MessageButton } from "discord.js";
import {
  ButtonInteraction,
  Client,
  Interaction,
  MessageEmbed,
} from "discord.js";
import { getTestMode } from "../Util/Functions/managers/littleManagers/cacheManager";

export const run = async (client: Client, Interaction: Interaction) => {
  if (getTestMode() == true) return;
  if (Interaction.isButton() == true) {
    const ww = Interaction as ButtonInteraction;

    const button = new MessageButton()
      .setLabel("No")
      .setStyle("DANGER")
      .setCustomId("no");
    const components = new MessageActionRow().addComponents(button);

    if (ww.customId == "spam_close") {
      const m1 = await ww.reply({
        content: `¿En serio no quieres verlo? 😭`,
        components: [components],
        ephemeral: true,
      });
    } else if (ww.customId == "no") {
      const boton = button
        .setLabel(`No valoro el trabajo de los demás.`)
        .setCustomId(`BAD`);
      ww.reply({
        ephemeral: true,
        content: `¿Sabías que fueron más de 500 líneas de codigo para eso?`,
        components: [new MessageActionRow().addComponents(boton)],
      });
    } else if (ww.customId == "BAD") {
      console.log(`${ww.member.user.tag} no valora el trabajo de los demás.`);
      await ww.reply({
        content: `Bueno bueno 😭😭😭😭🙄🙄, ya te cerré el mensaje 😭`,
        ephemeral: true,
      });
      await (await ww.channel.messages.fetch())
        .filter((x) => x.embeds[0]?.author?.name == "¡Pruebame!")
        .map((x) => x.delete());
    }
  }
};
