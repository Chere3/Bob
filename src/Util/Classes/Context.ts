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

type options = "boterror" | "error" | "info" | "good" | undefined;

export class TempContext {
  message: Message;
  client: Client;
  config: typeof config;
  args: string[];
  constructor(Temp: Client, message: Message) {
    this.message = message;
    this.client = Temp;
    this.config = config;
    this.args = [];
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

  b(
    type: MessageButtonStyle,
    content: string,
    id: string = "a",
    desactivated: boolean = false
  ) {
    const button = new MessageButton()
      .setStyle(type)
      .setLabel(content)
      .setCustomId(id)
      .setDisabled(desactivated);

    return button;
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
}
