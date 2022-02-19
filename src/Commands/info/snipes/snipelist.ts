import { ButtonInteraction, Client, MessageEmbed, SelectMenuInteraction, TextChannel } from "discord.js";
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { emojis } from "../../../Util/constants/emojis";
import { getChannel } from "../../../Util/Functions/utils/apiUtil";
import { timeDifference } from "../../../Util/Functions/utils/textUtil";
import { getDBChannel } from "../../../Util/managers/channelManager";
import { combineAll, constructMenu } from "../../../Util/managers/littleManagers/snipeManager";


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "snipelist",
description: "Muestra la lista de snipes. [sub comando de snipe.]",
category: "info",
aliases: ["snipes"],
usage: (prefix: "prefix") => "snipelist [canal]",
example: (prefix: "prefix") => "snipelist [canal]",
      })
  }


async run(base: TempContext) {
    var comando = base.message.content.split(" ")[0];
    const cont = (base.message.content.includes(this.name) && !base.flags.includes("list")) == true ? base.args : base.args?.slice(1);
    const channel = base.args[0] ? await getChannel(cont.join(" "), base.message) as TextChannel ?? base.channel : base.channel as TextChannel;

    var snipes = await (await getDBChannel(channel.id)).snipes;
    const nsfw = channel.nsfw == true ? true : channel.name.includes(`🔞`) == true ? true : false;
    const nsfww = base.channel.nsfw == true ? true : base.channel.name.includes(`🔞`) == true ? true : false;
    const universalEmbed = new MessageEmbed().setColor("PURPLE");
    if (nsfw == true && nsfww == false) return base.message.reply({embeds: [universalEmbed.setDescription(`> ${emojis.zdo_tonto} __**No puedes ver los mensajes borrados de un canal nsfw, estando en un canal SFW**__\n\n> __**El canal ${channel} es un canal NSFW.**__`)]});

    if (snipes.length < 2) return base.message.reply({embeds: [universalEmbed.setDescription(`> __**Se necesitan por lo menos 2 mensajes borrados para que este comando funcione, y este canal solo tiene ${snipes.length} mensajes borrados registrados.**__`)]});
    const menu = await constructMenu(base.message);
    const m1 = await base.message.reply({components: [menu], embeds: [universalEmbed.setAuthor({name: snipes[0].messageAuthor, iconURL: snipes[0].messageAuthorAvatar}).setDescription(snipes[0].messageContent).setFooter({text: `Borrado ${timeDifference(Date.now(), snipes[0].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png`}).setImage(snipes[0].messageAttachments[0] ?? null).setTimestamp(snipes[0].messageTimestamp)]});
    const aw1 = await m1.createMessageComponentCollector({max: 25, time: 60000});

    aw1.on("collect", async (a) => {
        const mm = a as SelectMenuInteraction;
        if (a.isButton() == true) return;
        if (mm.member.id !== base.message.member.id) return mm.reply({content: `PRIVATE INSTANCE MISSING TYPE 2`, ephemeral: true});;
        const value = Number(mm.values[0]); const archivos = combineAll(snipes[value].messageAttachments, snipes[value].messageStickers);
        if (!archivos.length) {
            mm.update({embeds: [universalEmbed.setDescription(snipes[value].messageContent ?? "ㅤ").setImage(null).setAuthor({name: snipes[value].messageAuthor, iconURL: snipes[value].messageAuthorAvatar}).setFooter({text: `Borrado ${timeDifference(Date.now(), snipes[value].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png`}).setTimestamp(snipes[value].messageTimestamp)]});
        } else if (archivos.length == 1) {
            if (archivos[0].includes(".mp4")) {
                mm.update({embeds: [universalEmbed.setDescription(`${snipes[value].messageContent ?? "ㅤ"}\n\n__**[Vídeo borrado](${archivos[0]})**__`).setAuthor({name: snipes[value].messageAuthor, iconURL: snipes[value].messageAuthorAvatar}).setFooter({text: `Borrado ${timeDifference(Date.now(), snipes[value].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png`}).setTimestamp(snipes[value].messageTimestamp)]});
            } else {
                mm.update({embeds: [universalEmbed.setDescription(snipes[value].messageContent ?? "ㅤ").setImage(archivos[0] ?? null).setAuthor({name: snipes[value].messageAuthor, iconURL: snipes[value].messageAuthorAvatar}).setFooter({text: `Borrado ${timeDifference(Date.now(), snipes[value].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png`}).setTimestamp(snipes[value].messageTimestamp)]});
            }
        } else if (archivos.length > 1) {
            const m2 = await mm.update({embeds: [universalEmbed.setDescription(snipes[value].messageContent ?? "ㅤ").setAuthor({name: snipes[value].messageAuthor, iconURL: snipes[value].messageAuthorAvatar}).setFooter({text: `Borrado ${timeDifference(Date.now(), snipes[value].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png`}).setTimestamp(snipes[value].messageTimestamp)], components: [base.ar(base.b("SECONDARY", ".", "right", false, emojis.right_arrow), base.db, base.db, base.b("SECONDARY", ".", "left", false, emojis.left_arrow)), menu]});
            const collector = [];
            for (let i = 0; i < archivos.length; i++) {
                collector.push(new MessageEmbed().setColor(`PURPLE`).setDescription(snipes[value].messageContent ?? "ㅤ").setImage(archivos[i] ?? null).setAuthor({name: snipes[value].messageAuthor, iconURL: snipes[value].messageAuthorAvatar}).setFooter({text: `Borrado ${timeDifference(Date.now(), snipes[value].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png`}).setTimestamp(snipes[value].messageTimestamp));
            }
            
            var page: any = 0;

            const aw1 = await m1.createMessageComponentCollector({time: 60000, componentType: "BUTTON", max: 20});
            await aw1.on("collect", async (a) => {
                const cc = a as ButtonInteraction;

                if (cc.member.id !== base.message.author.id) return cc.reply({content: `PRIVATE INSTANCE MISSING TYPE 2`, ephemeral: true});
                if (cc.customId == "right") {
                    if (page !== 0) {
                        --page;
                        cc.update({embeds: [collector[page]]});
                    } else {
                        page = [collector.length - 1];
                        cc.update({embeds: [collector[page]]});
                    }
                } else if (cc.customId == "left") {
                    if (page < collector.length - 1) {
                        page++;
                        cc.update({embeds: [collector[page]]});
                    } else {
                        page = 0;
                        cc.update({embeds: [collector[page]]});
                    }
                }
            })
        }
    })
}}