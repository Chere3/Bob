import { Client, MessageEmbed, RateLimitError } from "discord.js";
import superagent from "superagent";
import { getTestMode } from "../../Util/managers/littleManagers/cacheManager";

export const run = async (client: Client, a: RateLimitError) => {
  if (getTestMode() == true) return;
  const embed = new MessageEmbed()
    .setAuthor(`Error.`)
    .setDescription(`\`\`\`fix\n ${a.message}\`\`\``)
    .setTimestamp()
    .setColor("RED");
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
