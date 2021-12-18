import { Client, MessageEmbed } from "discord.js";
import superagent from "superagent";
import { getTestMode } from '../Util/Functions/managers/littleManagers/cacheManager';
export const run = async (bot: Client, debug: string) => {
  if (getTestMode() == true) return;
  const embed = new MessageEmbed()
    .setAuthor(`Encendido logs.`)
    .setDescription(`\`\`\`fix\n ${debug}\`\`\``)
    .addField(`Ping`, `\`\`\`javascript\n ${bot.ws.ping}ms\`\`\``)
    .setTimestamp()
    .setColor(`#00ff00`);
  await superagent
    .post(process.env.AUTH_LOGS)
    .send({ embeds: [embed] })
    .catch(async () => {
      await superagent
        .post(process.env.AUTH_R_LOGS)
        .send({ embeds: [embed] })
        .catch(async () => {
          await superagent
            .post(process.env.AUTH_RR_LOGS)
            .send({ embeds: [embed] })
            .catch(() => {
              console.log(
                `No pude enviar el mensaje de la webhook debido a un error.`
              );
            });
        });
    });
};
