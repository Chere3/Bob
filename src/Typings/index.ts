import { Collection } from "discord.js";
import { BaseCommand } from "../Util/Classes/BaseCommand";
import Captain from "captainjs";
import { BaseSlashCommand } from "../Util/Classes/BaseSlashCommand";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, BaseCommand>;
    slashCommands: Collection<string, BaseSlashCommand>;
    cleverCooldown: Collection<string, number>;
  }

  interface Channel {
    nsfw?: boolean;
    name: string | null;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      MONGO_URI: string;
      MONGO_URI2: string;
      MONGO_API: string;
      AUTH_LOGS: string;
      AUTH_R_LOGS: string;
      AUTH_RR_LOGS: string;
    }

    interface Global {
      prettyConsole: Captain.Console;
    }
  }
}
