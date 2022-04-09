// @ts-nocheck
import { GuildMember, Message } from "discord.js";

/**
 * The args util of the commands to get different things.
 */
export class argsUtil {
    
    args: string[];
    message: Message
    /**
     * The main constructor of the args util.
     */
constructor(args: string[], message: Message) {
    this.args = args
    this.message = message
}

/**
 * @method areArgsValid | Comprueba si los argumentos son válidos.
 * @param {string} query - La palabra a buscar.
 * @param {string[]} array - El array donde buscar.
 * @return {boolean} Si los argumentos son válidos.
 * @author Cheree
 * @example
 * new argsUtil(args, message).areArgsValid("cheree", [`cheree`, `cheree2`, `cheree3`])
 */

areArgsValid(query: string, targetStrings: string[]) {
    if (!query) return false;
    if (!targetStrings) return false;
    if (typeof query !== "string") return false;
    if (!Array.isArray(targetStrings)) return false;
    if (targetStrings.length == 0) return false;
    return true;
}

/**
 * @method CompareTwoString | Compara dos strings y devuelve el mejor match.
 * @param {string} query - La palabra a buscar.
 * @param {string[]} array - El array donde buscar.
 * @return {number} El mejor match.
 * @author Cheree
 * @example
 * new argsUtil(args, message).CompareTwoString("cheree", "cherry")
 */

compareTwoString(query: string, targetString: string) {
    query = query.replace(/\s+/g, "")
    targetString = targetString.replace(/\s+/g, "")

    if (query == targetString) return 1;
    if (query.length < 2 || targetString.length < 2) return 0;

    let firstBigrams = new Map();
    for (let i = 0; i < query.length - 1; i++) {
        const bigram = query.substring(i, i + 2);
        const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1

        firstBigrams.set(bigram, count)
    }

    let intersectionSize = 0;
    for (let i = 0; i < targetString.length - 1; i++) {
        const bigram = targetString.substring(i, i + 2);
        const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0

        if (count > 0) {
            firstBigrams.set(bigram, count - 1)
            intersectionSize++
        }
    }

    return (2.0 * intersectionSize) / (query.length + targetString.length - 2)
}

/**
 * @method findBestMatch | Devuelve el mejor match de una palabra en un array.
 * @param {string} query - La palabra a buscar.
 * @param {string[]} array - El array donde buscar.
 * @return {string} El mejor match de la palabra en el array.
 * @author Cheree
 * @example
 * new argsUtil(args, message).findBestMatch(`cheree`, [`cheree`, `cheree2`, `cheree3`])
 */

findBestMatch(query: string, targetStrings: string[]) { 
if (!this.areArgsValid(query, targetStrings)) throw TypeError(`Los argumentos que has dado no son correctos.`);
interface rating {
    target: string;
    rating: number;
}
const ratings = [] as rating[]; let bestMatchIndex = 0;
for (let i = 0; i < targetStrings.length; i++) {
    const currentTargetString = targetStrings[i];
    const currentRating = this.compareTwoString(query, currentTargetString);
    ratings.push({target: currentTargetString, rating: currentRating});
    if (currentRating > ratings[bestMatchIndex].rating) {
        bestMatchIndex = i;
    }
}

return {
    ratings: ratings,
    bestMatch: ratings[bestMatchIndex],
    bestMatchIndex: bestMatchIndex
}
}

/**
 * @method getMember - Get the member of the message.
 * @param {string} query - The query of the member.
 * @return {GuildMember} The member of the message.
 * @example
 * new argsUtil(args, message).getMember(`cheree`)
 */

async getMember() {
    if (!this?.args![0]) throw TypeError(`No query provided.`);
    if (!this?.message) throw TypeError(`No message provided.`);

    var person: GuildMember;
    try {
        if (this.args[0].startsWith("<@") && this.args[0].endsWith(">")) {
            const id = this.args[0].replace(/[<@!>]/g, "");
            const user = await this.message.guild.members.fetch(id);
            person = user;
        } else if (this.args[0].match(/\d{16,22}$/gi)) {
            const user = await this.message.guild.members.fetch(this.args[0]);
            person = user;
        } else if (this.args[0].match(/^.{1,32}(#)+\d{4}$/gim)) {
            const user = await this.message.guild.members.cache.find(x => x.user.tag == this.args[0]);
            person = user
        } else if (this.args[0].match(/^.{1,32}$/gi)) {
            
            const a = await this.message.guild.members.cache.map(x => x.user.username?.toLowerCase()).filter(x => x !== null);
            const b = await this.message.guild.members.cache.map(x => x.nickname?.toLowerCase()).filter(x => x !== undefined);
            
            const one = this.findBestMatch(this.args[0].toLowerCase(), a).bestMatch.target;
            const two = this.findBestMatch(this.args[0].toLowerCase(), b).bestMatch.target;
            
            const reg1 = new RegExp(one, "i");
            const reg2 = new RegExp(two, "i"); var aa = [];
            aa.push(one, two); const best1 = this.findBestMatch(this.args[0].toLowerCase(), aa).bestMatch.target;
            

            var final = await this.message.guild.members.cache.find(x => reg1.test(x.user.username.toLowerCase()) ? x.user.username.toLowerCase() === best1 : x.user.username.toLowerCase() === best1);
            var final1 = await this.message.guild.members.cache.find(x => reg2.test(x?.nickname?.toLowerCase()) ? x?.nickname?.toLowerCase() === best1 : x?.nickname?.toLowerCase() === best1);
            

            const uno = final?.user?.username || "/\/\/\/\/\/\///\/\/\/\/\/\/\/\/\/\///\/\/\///////\/\/\/\//\/\/\/\/\//\/\/\\//\/\/\/\/\/\/\/\//\/\/\////";
            const dos = final1?.nickname || "/\/\/\/\/\/\///\/\/\/\/\/\/\/\/\/\///\/\/\///////\/\/\/\//\/\/\/\/\//\/\/\\//\/\/\/\/\/\/\/\//\/\/\////"; var bb = [];
            
            bb.push(uno, dos);
            const best2 = this.findBestMatch(this.args[0].toLowerCase(), bb).bestMatch.target;

            if (best2 === uno) {
                person = final;
            } else person = final;
        } else {
            person = this.message.guild.members.cache.get(this.message.mentions.repliedUser?.id) || null;
        }
    } catch (e) {
        person = this.message.guild.members.cache.get(this.message.mentions.repliedUser?.id) || null;
        console.log(e)
    }

    return person;
    }
}