import { config as envconfig } from "dotenv";

envconfig();

export const config = {
  auth: {
    token: process.env.TOKEN,
    mongoURI: process.env.MONGO_URI,
  },
  prefix: "s!",
  serverInvite: "discord.gg/",
  owners: ["642159495660830740", "852588734104469535"],
};
