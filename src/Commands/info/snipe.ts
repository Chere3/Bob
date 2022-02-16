import { ButtonInteraction, Client, MessageEmbed, SelectMenuInteraction } from 'discord.js';
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import { getDBChannel } from "../../Util/managers/channelManager";
import { combineAll, constructMenu } from '../../Util/managers/littleManagers/snipeManager';
import { getChannel } from '../../Util/Functions/utils/apiUtil';
import { emojis } from '../../Util/constants/emojis';


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "snipe",
description: "Muestra el ultimo mensaje borrado en ese canal.",
category: "info",
cooldown: 5,
aliases: ["snipes", "sniper"],
      })
  }


async run(base: TempContext) {
    
    var snipes = await (await getDBChannel(base.channel.id)).snipes;
    const universalEmbed = new MessageEmbed().setColor("PURPLE");

    var args = Number(base.args[0]) || Number(base.args[1]) || 1;



    if (isNaN(Number(base.args[0]))) {


        if (base.args[0] === "list" || base.flags[0] === "list") {
            if (snipes.length < 2) return base.message.reply({embeds: [universalEmbed.setAuthor(`No hay suficientes mensajes borrados.`).setDescription(`El snipe 2 no existe aún en ${base.channel}`)]})


            const menu = await constructMenu(base.message);
            const m1 = await base.message.reply({components: [menu], embeds: [universalEmbed.setAuthor(snipes[0].messageAuthor, snipes[0].messageAuthorAvatar).setDescription(`${snipes[0].messageContent}`).setFooter(`Snipe 1.`).setImage(snipes[0].messageAttachments[0] || null).setTimestamp(snipes[0].messageTimestamp)]});
            const aw1= await m1.createMessageComponentCollector({max: 25, time: 60000});

            return aw1.on("collect", async (m) => {
                const mm = m as SelectMenuInteraction;

                if (!mm.values[0]) return;

                if (mm.member.id !== base.message.member.id) return mm.reply({content: `Hey!, solo el autor del mensaje puede hacer esto.`, ephemeral: true})

                const value = Number(mm.values[0]);
                const archivos = combineAll(snipes[value].messageAttachments, snipes[value].messageStickers);
               if (!archivos.length) {
                   mm.update({embeds: [universalEmbed.setDescription(`${snipes[value].messageContent|| "ㅤ"}`).setAuthor(snipes[value].messageAuthor, snipes[value].messageAuthorAvatar).setTimestamp(snipes[value].messageTimestamp).setImage(null).setFooter(`Snipe ${value + 1}`)]});
               } else if (archivos.length == 1) {
                if (archivos[0].includes(".mp4")) {
                    mm.update({embeds: [universalEmbed.setDescription(`${snipes[value].messageContent || "ㅤ"}\n\n**[Archivo](${archivos[0]})**`).setTimestamp(snipes[value].messageTimestamp).setFooter(`Snipe ${args + 1}`).setAuthor(snipes[value].messageAuthor, snipes[value].messageAuthorAvatar)]});
                }
                mm.update({embeds: [universalEmbed.setDescription(`${snipes[value].messageContent || "ㅤ"}`).setImage(archivos[0] || null).setAuthor(snipes[value].messageAuthor, snipes[value].messageAuthorAvatar).setTimestamp(snipes[value].messageTimestamp).setFooter(`Snipe ${args + 1}`)]});
            } else if (archivos.length > 1) {

                const m2 = await mm.update({embeds: [universalEmbed.setDescription(`${snipes[value].messageContent || "ㅤ"}`).setImage(archivos[0] || null).setAuthor(snipes[value].messageAuthor, snipes[value].messageAuthorAvatar).setTimestamp(snipes[value].messageTimestamp).setFooter(`Snipe ${value + 1}`)], components: [base.ar(base.b("SECONDARY", ">>", "right", false ,emojis.right_arrow), base.b("SECONDARY", "ㅤ", "aaa", true),base.b("SECONDARY", "ㅤ", "bbb", true), base.b("SECONDARY", "<<", "left", false, emojis.left_arrow))]})
    
                const collector = [];
                for (let i = 0; i < archivos.length; i++) {
                    
                    collector.push(new MessageEmbed().setColor(`PURPLE`).setDescription(`${snipes[value].messageContent || "ㅤ"}`).setImage(archivos[i] || null).setAuthor(snipes[value].messageAuthor, snipes[value].messageAuthorAvatar).setTimestamp(snipes[value].messageTimestamp).setFooter(`Snipe ${value + 1}`))
                }
    
                var page: any = 0
    
                const aw1 = await m1.createMessageComponentCollector({
                    time: 60000,
                    componentType: "BUTTON",
                    max: 20
                });
    
                aw1.on("collect", async (c) => {
    
                    const cc =  c as ButtonInteraction;
    
                    if (cc.member.id !== base.message.author.id) return cc.reply({content: `HEY! Solo el autor del mensaje puede hacer esto.`, ephemeral:true})
                    if (cc.customId == "right") {
                        if (page !== 0) {
                            --page;
                            cc.update({embeds: [collector[page]]})
                        } else {
                            page = [collector.length - 1];
                            cc.update({embeds: [collector[page]]})
                        }
                    } else if (cc.customId == "left") {
                        if (page < collector.length - 1) {
                            page++;
                            cc.update({embeds: [collector[page]]})
                        } else {
                            page = 0
                            cc.update({embeds: [collector[page]]})
                        }
                    }
                })
    
                aw1.on("end", () => {
                    m1.edit({embeds: [m1.embeds[0]], components: [base.ar(base.b("SECONDARY", ">>", "right", true, emojis.right_arrow), base.b("SECONDARY", "ㅤ", "aaa", true),base.b("SECONDARY", "ㅤ", "bbb", true), base.b("PRIMARY", "<<", "left", true, emojis.left_arrow))]})
                })
                
            }

            })

        } else if (base.flags[0] == "edit") {
            base.client.commands.get("editsnipe").run(base)
        }
        
        else {
            var canal = await getChannel(base.args[0], base.message) || base.message.channel;
            snipes = await (await getDBChannel(canal.id)).snipes
        }
        
    }


    if (args > snipes.length) return base.message.reply({embeds: [universalEmbed.setAuthor(`No hay suficientes mensajes borrados.`).setDescription(`El snipe ${args} ${canal == undefined ? "no existe aun" : `no existe aun en <#${canal.id}>`}`)]})

    if (!snipes.length) {
        return base.message.reply({embeds: [universalEmbed.setDescription("**No hay mensajes borrados en este canal.**").setDescription(`No hay mensaje borrados en ${canal}`).setImage(null).setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`)]});
    } else {
        const archivos = combineAll(snipes[args - 1].messageAttachments, snipes[args - 1].messageStickers)
        if (!archivos.length) {
            return base.message.reply({embeds: [universalEmbed.setDescription(`${snipes[args - 1].messageContent|| "ㅤ"}`).setAuthor(snipes[args - 1].messageAuthor, snipes[args - 1].messageAuthorAvatar).setTimestamp(snipes[args - 1].messageTimestamp).setImage(null).setFooter(`Snipe ${args}`)]});
        } else if (archivos.length == 1) {
            if (archivos[0].includes(".mp4") || archivos.includes(".webm")) {
                return base.message.reply({embeds: [universalEmbed.setDescription(`${snipes[args - 1].messageContent || "ㅤ"}\n\n**[Archivo](${archivos[0]})**`).setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`).setAuthor(snipes[args - 1].messageAuthor, snipes[args - 1].messageAuthorAvatar)]});
            }
            return base.message.reply({embeds: [universalEmbed.setDescription(`${snipes[args - 1].messageContent || "ㅤ"}`).setImage(archivos[0] || null).setAuthor(snipes[args - 1].messageAuthor, snipes[args - 1].messageAuthorAvatar).setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`)]});
        } else if (archivos.length > 1) {

            const m1 = await base.message.reply({embeds: [universalEmbed.setDescription(`${snipes[args - 1].messageContent || "ㅤ"}`).setImage(archivos[0] || null).setAuthor(snipes[args - 1].messageAuthor, snipes[args - 1].messageAuthorAvatar).setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`)], components: [base.ar(base.b("SECONDARY", ">>", "right", false, emojis.right_arrow), base.b("SECONDARY", "ㅤ", "aaa", true),base.b("SECONDARY", "ㅤ", "bbb", true), base.b("SECONDARY", "<<", "left", false, emojis.left_arrow))]})

            const collector = [];
            for (let i = 0; i < archivos.length; i++) {
                
                collector.push(new MessageEmbed().setColor(`PURPLE`).setDescription(`${snipes[args - 1].messageContent || "ㅤ"}`).setImage(archivos[i] || null).setAuthor(snipes[args - 1].messageAuthor, snipes[args - 1].messageAuthorAvatar).setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`))
            }

            var page: any = 0

            const aw1 = await m1.createMessageComponentCollector({
                time: 60000,
                componentType: "BUTTON",
                max: 20
            });

            aw1.on("collect", async (c) => {

                const cc =  c as ButtonInteraction;

                if (cc.member.id !== base.message.author.id) return cc.reply({content: `HEY! Solo el autor del mensaje puede hacer esto.`, ephemeral:true})
                if (cc.customId == "right") {
                    if (page !== 0) {
                        --page;
                        cc.update({embeds: [collector[page]]})
                    } else {
                        page = [collector.length - 1];
                        cc.update({embeds: [collector[page]]})
                    }
                } else if (cc.customId == "left") {
                    if (page < collector.length - 1) {
                        page++;
                        cc.update({embeds: [collector[page]]})
                    } else {
                        page = 0
                        cc.update({embeds: [collector[page]]})
                    }
                }
            })

            aw1.on("end", () => {
                m1.edit({embeds: [m1.embeds[0]], components: [base.ar(base.b("SECONDARY", ">>", "right", true, emojis.right_arrow), base.b("SECONDARY", "ㅤ", "aaa", true),base.b("SECONDARY", "ㅤ", "bbb", true), base.b("SECONDARY", "<<", "left", true, emojis.left_arrow))]})
            })
            
        }
    }

}}