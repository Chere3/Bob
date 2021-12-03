import { Client, Collection, CommandInteraction } from "discord.js";
import { slashOptions, slashStructure } from "../constants/slash";
import { config } from "../../config";
export interface slash {
  name: string;
  type: slashOptions;
  description: string;
  dev?: boolean;
  nsfw?: boolean;
  cooldown?: number;
  options?: slashStructure[];
}

export class BaseSlashCommand {
  bot: Client;
  name: string;
  type: slashOptions;
  description: string;
  dev: boolean;
  nsfw: boolean;
  cooldown: number;
  cooldowns: Collection<string, number>;
  options: slashStructure[];

  constructor(client: Client, options: slash) {
    this.bot = client;
    this.name = options.name;
    this.type = options.type;
    this.description = options.description;
    this.dev = options.dev || false;
    this.nsfw = options.nsfw || false;
    this.cooldown = options.cooldown || 2;
    this.options = options.options;
  }

  go(int: any) {
    const interaction = int as CommandInteraction;
    if (this.dev === true) {
      if (
        config.owners.find((id) => id === interaction.member.id) !== undefined
      ) {
        return interaction.reply({
          content:
            "Este comando es exclusivo para desarrolladores del bot; y tú no eres uno de ellos.",
          ephemeral: true,
        });
      } else if (this.nsfw === true) {
        if (interaction.channel.nsfw == false) {
          return interaction.reply({
            content: "Este comando solo puede ser usado en canales NSFW.",
            ephemeral: true,
          });
        } else if (this.checkCooldown(int)) {
          const now = Date.now();
          const time = this.cooldowns.get(interaction.member.id);
          const timeLeft = (time - now) / 1000;
          return interaction.reply({
            content: `Este comando está en cooldown, espera ${timeLeft.toFixed(
              1
            )}`,
            ephemeral: true,
          });
        }
      }
    }

    return false;
  }

  checkCooldown(int: any) {
    const intt = int as CommandInteraction;
    if (this.cooldowns.has(intt.member.id)) {
      const cooldown = this.cooldowns.get(intt.member.id);
      const time = Date.now() - cooldown;
      if (time > this.cooldown) {
        this.cooldowns.set(intt.member.id, Date.now());
        return true;
      } else {
        return false;
      }
    }
  }
}
