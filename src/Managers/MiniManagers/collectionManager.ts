// @ts-nocheck
import { Message, MessageActionRow, MessageEmbed, User } from "discord.js";

export interface msgCollector {
    embeds: MessageEmbed[];
    message: Message
    author: User
    time: number
    limit: number
    filter: any
}

/**
 * The constructor of the messageCollector.
 */

export class messageCollector {
    embeds: MessageEmbed[];
    message: Message
    author: User
    time: number
    limit: number
    filter: any

    /**
     * @typedef {Object} - The options of the messageCollector.
     * @property {MessageEmbed[]} embeds The embeds of the message.
     * @property {Message} message The message to make the message button collector in.
     * @property {number} time The max time to make the collector.
     * @property {number} limit The max limit to receive interactions of this.
     * @property {filter} filter The filter of the message button collector.
     */

    /**
     * @param {msgCollector} data - The data of the message button collector.
     */
    constructor(data = {} as msgCollector) {
        this.setup(data)
    }

    
    /**
     * @method setup - The setup of the predef data of the constructor.
     * @param {msgCollector} data - The data of the constructor.
     */

    setup(data) {
        const d = data as msgCollector
        /**
         * The embeds of the command
         * @type {MessageEmbed[]}
         */

        if (!d.embeds || !d.embeds[0]) return;

        this.embeds = d.embeds ?? null;
        
        /**
         * The message to be collected
         * @type {Message}
         */

        this.message = d.message ?? null;

        /**
         * The number of time.
         * @type {number}
         */

        this.time = d.time ?? null;

        /**
         * The number of each interaction.
         * @type {number}
         */

        this.limit = d.limit ?? null;

        /**
         * The filter of the interaction
         * @type {any}
         */

        this.filter = d.filter ?? null;
    }

    /**
     * @method set the embeds of the Object.
     * @param {MessageEmbed[]} embeds The embeds to put in the constructor.
     */
    setEmbeds(embeds: MessageEmbed[]) {
        if (embeds instanceof Array !== true) throw TypeError(`No se ha detectado un array en este valor.`);
        if (embeds[0] == undefined ||embeds[0].constructor.name !== "MessageEmbed") throw TypeError(`Tiene que ser un embed el que este en el array.`);

        this.embeds = embeds
        return this
    }

    /**
     * @method set the Message of the Object.
     * @param {Message} message The message to put in the constructor
     */

    setMessage(message: Message) {
        if (message.constructor.name !== "Message") throw TypeError(`No se ha detectado el mensaje.`);

        this.message = message
        return this
    }

    /**
     * @method set the author of the message that triggered the command of the message
     * @param {User} author Set the author for the
     */

    setAuthor(author: User) {
        if (author.constructor.name !== "User") throw TypeError(`No se ha detectado el usuario.`);

        this.author = author;
        return this;
    }

    /**
     * @method set the seconds to limit.
     * @param {time} time The limit of time to stop receiving interactions.
     */

    setTime(time: number) {
        if (typeof time !== "number") throw TypeError(`Este no es un numero.`);

        this.time = time;
        return this
    }

    /**
     * @method Set the limit of the Object.
     * @param {limit} limit The limit to stop receiving interactions.
     */

    setLimit(limit: number) {
        if (typeof limit !== "number") throw TypeError(`Este no es un numero.`);

        this.limit = limit
        return this
    }

    /**
     * @method Set the filter of the object.
     * @param {any} filter The filter of receiving interactions.
     */

    setFilter(filter: any) {
        this.filter = filter;
        return this
    }
}

export class messageCollect extends messageCollector {
    constructor() {
        super()
    }

    async start() {
        // predefinited values
        const m = (a) => a
        this.filter = this.filter ?? m;
        this.embeds = this.embeds ?? [];
        this.limit = this.limit ?? 100;
        this.time = this.time ?? 60000;

        console.log(this.embeds)

        if (!this.message || !this.embeds[0] || !this.author) throw TypeError(`Los valores obligatorios no se han detectado. Por lo cual no se puede continuar con la operacion`);
        if (!this.message?.components[0]) throw TypeError(`El mensaje que has dado, al parecer no tiene ningun boton, intenta con uno que si tenga.`)

        var page: any = 0;
        const aw1 = await this.message.createMessageComponentCollector({
            time: this.time,
            componentType: "BUTTON",
            max: this.limit,
            filter: this.filter
        });

        aw1.on("collect", async (c) => {
            if (c.member.id !== this.author.id) return c.reply({content: `> __*Esta interaccion no es tuya, debes de ser el autor del mensaje para poder continuar.*__`});

            if (c.customId == "left") {
                if (page !== 0) {
                    --page;
                    c.update({embeds: [this.embeds[page]]})
                } else {
                    page = [this.embeds.length - 1];
                    c.update({embeds: [this.embeds[page]]})
                }
            } else if (c.customId == "right") {
                if (page < this.embeds.length - 1) {
                    page++;
                    c.update({embeds: [this.embeds[page]]})
                } else {
                    page = 0;
                    c.update({embeds: [this.embeds[page]]})
                }
            }
        })
        
        aw1.on("end", async (c) => {
            const components = [];
        for (const com of this.message.components[0].components) {
            components.push(com.setDisabled(true))
        }

            const aw2 = new MessageActionRow().addComponents(...components);
            this.message.edit({embeds: [this.message.embeds[0]], components: [aw2]})
        })

        
    }
}