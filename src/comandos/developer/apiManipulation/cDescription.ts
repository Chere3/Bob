import { Client, MessageButton, MessageEmbed } from "discord.js";
import emojis from "../../../assets/emojis";
import { botCommand, revisionManager } from "../../../Managers/CommandsManager/NormalCommands/revisionManager";
import { run } from "../../../Managers/CommandsManager/NormalCommands/runManager";

export default class cDescription extends revisionManager {
    constructor(client: Client) {
        super(client, new botCommand()
            .setName(`description`)
            .setInfoOptions({description: `Muestra la descripcion del comando.`, usage: "cdescription", examples: ["cdescription"]})
            .setCommandOptions({expectedArgs: 0, expectedArgsMin: 0, aliases: ["changedescription"]})
            .setChannelAndGuildOptions({developer: true})
        )   
    }

    async run(b: run) {
            const aw1= await b.send({embeds: [new MessageEmbed().setAuthor({name: `Gestor de descripciones`}).setColor(`PURPLE`).setDescription(`Este funciona como el gestor principal de las descripciones de los comandos sociales, para empezar;
            selecciona una opcion.`)], components: [b.buttonCollector([new MessageButton().setLabel(`Agregar descripcion`).setCustomId(`adddesc`).setStyle(`PRIMARY`), new MessageButton().setLabel(`Eliminar descripcion`).setCustomId(`deldesc`).setStyle(`PRIMARY`), new MessageButton().setLabel(`Editar descripcion`).setCustomId(`editdesc`).setStyle(`PRIMARY`)])]});
            // @ts-ignore
            const aw2 = aw1.createMessageComponentCollector({componentType: "BUTTON", filter: (m) => m.member.user.id == b.member.id, time: 60000});

            aw2.on("collect", async (a) => {
                switch (a.customId) {
                    case "adddesc":
                        a.update({embeds: [new MessageEmbed().setAuthor({name: `Agregar descripcion`}).setColor(`PURPLE`).setDescription(`Escribe la descripcion que quieres agregar.`)], components: [b.buttonCollector([new MessageButton().setDisabled(true).setStyle(`SECONDARY`).setEmoji(emojis.rs_inivisble).setCustomId(`omg`)])]});
                        const p = await b.channel.awaitMessages({filter: (m) => m.member!.user!.id == b.member!.id, time: 60000, max: 1}); if (!p?.first()) return a.update({embeds: [new MessageEmbed().setAuthor({name: `Agregar descripcion`}).setColor(`PURPLE`).setDescription(`Se ha agotado el tiempo de espera.`)], components: [b.buttonCollector([new MessageButton().setDisabled(true).setStyle(`SECONDARY`).setEmoji(emojis.rs_inivisble).setCustomId(`omg`)])]});
                        break;
                    case "deldesc":
                        a.update({embeds: [new MessageEmbed().setAuthor({name: `Eliminar descripcion`}).setColor(`PURPLE`).setDescription(`Escribe la descripcion que quieres eliminar.`)]});
                        break;
                    case "editdesc":
                        a.update({embeds: [new MessageEmbed().setAuthor({name: `Editar descripcion`}).setColor(`PURPLE`).setDescription(`Escribe la descripcion que quieres editar.`)]});
                        break;
                }
            })


    }
}