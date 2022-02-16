import { Client } from "discord.js";
import { db } from "../..";
import { getTestMode } from "../../Util/managers/littleManagers/cacheManager";
import { timeEventCore } from '../../Util/managers/timeManager';
export const run = async (bot: Client) => {
  if (getTestMode() == true) {
    await bot.user.setPresence({
      activities: [{ type: "WATCHING", name: "Modo de pruebas activado." }],
      status: "dnd",
    });


    global.prettyConsole.warn(`El modo de pruebas se ha activado correctamente`);

timeEventCore(bot);  
    

  } else {
    await bot.user.setPresence({
      activities: [
        { type: "WATCHING", name: "a ti" },
        { type: "WATCHING", name: "Furros en F&p" },
        { type: "WATCHING", name: "Paws en R34 owo" },
        { type: "WATCHING", name: "Tus secretos" },
      ],
      status: "idle",
    });

    global.prettyConsole.log(`El cliente esta listo.`);
  }
};
