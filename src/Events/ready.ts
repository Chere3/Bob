import { Client } from "discord.js";
export const run = async (bot: Client) => {
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
};
