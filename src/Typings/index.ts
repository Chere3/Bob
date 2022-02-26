import { Collection } from "discord.js";
import { BaseCommand } from "../Util/Classes/BaseCommand";
import Captain from "captainjs";
import { BaseSlashCommand } from "../Util/Classes/BaseSlashCommand";
import { cacheStructure } from '../Util/constants/cache';
import { allUtil } from "../Util/constants/evalUtil";
import { JsonDB } from "node-json-db";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, BaseCommand>;
    slashCommands: Collection<string, BaseSlashCommand>;
    cleverCooldown: Collection<string, number>;
    cooldoown: Collection<string, number>;
    invitations: Collection<string, Invite>;
    all: any;
    cache: cacheStructure;
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
      SENTRY: string;
      MONGO_URI: string;
      MONGO_URI2: string;
      MONGO_API: string;
      AUTH_LOGS: string;
      AUTH_R_LOGS: string;
      AUTH_RR_LOGS: string;
      API_IMGS: string;
    }

    interface Global {
      prettyConsole: Captain.Console;
    }
  }
}
