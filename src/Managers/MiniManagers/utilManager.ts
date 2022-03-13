/**
 * The class of the util things, convert things to string, etc.
 */
export default class utilManager {
    constructor() {}

    /**
     * @method divideTextIntoArrays - Divide the text into arrays of the given size.
     * @param text - The text to divide.
     * @param size - The size of the array.
     */

    divideTextIntoArrays(text: string, size: number): string[] {
        const array: string[] = [];
        for (let i = 0; i < text.length; i += size) {
            array.push(text.substr(i, size));
        }
        return array;
    }
}