import { Client } from "discord.js";
import { db } from "..";
import { getTestMode } from "../Util/Functions/managers/littleManagers/cacheManager";
export const run = async (bot: Client) => {
  if (getTestMode() == true) {
    await bot.user.setPresence({
      activities: [{ type: "WATCHING", name: "Modo de pruebas activado." }],
      status: "dnd",
    });


    console.log(`El modo de pruebas se ha activado correctamente`);
    const invites = await (await bot.guilds.cache.get(`912858763126538281`).invites.fetch()).map(x => x);

    var num = 1;

  
    

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
