import { config } from "../../config";
import {
  Message,
  MessageEmbed,
  Client,
  MessageButtonStyle,
  MessageButton,
  MessageSelectMenu,
  MessageActionRow,
} from "discord.js";
import { moderationutil } from "../constants/evalUtil";
import { moderationUtil } from "../managers/moderationManager";

type options = "boterror" | "error" | "info" | "good" | undefined;

export class TempContext {
  message: Message;
  client: Client;
  config: typeof config;
  args: string[];
  flags: string[];
  constructor(Temp: Client, message: Message) {
    this.message = message;
    this.client = Temp;
    this.config = config;
    this.args = [];
    this.flags = [];
  }

  get channel() {
    return this.message.channel;
  }
  get guild() {
    return this.message.guild;
  }
  get user() {
    return this.message.author;
  }
  get member() {
    return this.message.member;
  }
  
  get db() {
    const a = new moderationUtil().childRandom();
    return this.b("SECONDARY", "ㅤ", a, true)
  }

  get _INTERNAL_E_TEXT() {
    return `Mis sistemas han detectado un error interno en mi codigo, este ha sido notificado a mi desarrollador, por favor espera algun tiempo a que el error sea solucionado.`
  }

  l(content: string, link: string, disabled: boolean = false) {
    const button = new MessageButton()
      .setStyle(`LINK`)
      .setLabel(content)
      .setURL(`${link}`)
      .setDisabled(disabled);

    return button;
  }

  b(
    type: MessageButtonStyle,
    content: string,
    id: string = "a",
    desactivated: boolean = false,
    emoji?: string
  ) {

    if (!emoji) {
    const button = new MessageButton()
      .setStyle(type)
      .setLabel(content)
      .setCustomId(id)
      .setDisabled(desactivated);

    return button;} else {
      const button = new MessageButton()
      .setStyle(type)
      .setCustomId(id)
      .setDisabled(desactivated)
      .setEmoji(emoji);

      return button;
    }
  }

  ar(
    component1: MessageButton | MessageSelectMenu,
    component2?: MessageButton | MessageSelectMenu,
    component3?: MessageButton | MessageSelectMenu,
    component4?: MessageButton | MessageSelectMenu,
    component5?: MessageButton | MessageSelectMenu,
    component6?: MessageButton | MessageSelectMenu,
    component7?: MessageButton | MessageSelectMenu,
    component8?: MessageButton | MessageSelectMenu,
    component9?: MessageButton | MessageSelectMenu,
    component10?: MessageButton | MessageSelectMenu
  ) {
    const ar = new MessageActionRow();

    if (!component1) {
      throw new Error("You must provide at least one component");
    } else {
      if (component2) {
        if (component3) {
          if (component4) {
            if (component5) {
              if (component6) {
                if (component7) {
                  if (component8) {
                    if (component9) {
                      if (component10) {
                      } else {
                        ar.addComponents(
                          component1,
                          component2,
                          component3,
                          component4,
                          component5,
                          component6,
                          component7,
                          component8,
                          component9
                        );
                      }
                    } else {
                      ar.addComponents(
                        component1,
                        component2,
                        component3,
                        component4,
                        component5,
                        component6,
                        component7,
                        component8
                      );
                    }
                  } else {
                    ar.addComponents(
                      component1,
                      component2,
                      component3,
                      component4,
                      component5,
                      component6,
                      component7
                    );
                  }
                } else {
                  ar.addComponents(
                    component1,
                    component2,
                    component3,
                    component4,
                    component5,
                    component6
                  );
                }
              } else {
                ar.addComponents(
                  component1,
                  component2,
                  component3,
                  component4,
                  component5
                );
              }
            } else {
              ar.addComponents(component1, component2, component3, component4);
            }
          } else {
            ar.addComponents(component1, component2, component3);
          }
        } else {
          ar.addComponents(component1, component2);
        }
      } else {
        ar.addComponents(component1);
      }
    }

    return ar;
  }

  send(content: any, adds?: any) {
    return this.channel.send(content).catch((e) => {
      console.log(e);
    });
  }

  Getmember(id: string) {
    if (!this.guild.members.cache.get(id) == false) {
      return this.guild.members.cache.get(id) as any
    } else {
      return this.client.users.cache.get(id) as any
    }
  }

  async name(id: string) {
    if (!this.guild.members.cache.get(id) == false) {
      return this.guild.members.cache.get(id).nickname || this.guild.members.cache.get(id).user.username;
    } else {
      return await (await this.client.users.fetch(id)).username
    }
  }

  async avatar(id: string) {
    if (!this.guild.members.cache.get(id) == false) {
      return this.guild.members.cache.get(id).displayAvatarURL() || this.guild.members.cache.get(id).user.displayAvatarURL();
    } else {
      return await (await this.client.users.fetch(id)).displayAvatarURL()
    }
  }
  
}

