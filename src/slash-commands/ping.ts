import { BaseSlashCommand } from "../Util/Classes/BaseSlashCommand";
import { Client } from "discord.js";
export default class ping extends BaseSlashCommand {
  constructor(Client: Client) {
    super(Client, {
      name: "ping",
      description: "Ping del bot",
      type: 1,
    });
  }
}
