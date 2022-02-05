"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.separateArray = exports.areArgsValid = exports.compareTwoStrings = exports.findBestMatch = void 0;
function findBestMatch(mainString, targetStrings) {
    if (!areArgsValid(mainString, targetStrings))
        throw TypeError(`Los argumentos dados son incorrectos. Por favor revisa la funcion e intenta de nuevo más tarde.`);
    const ratings = [];
    let bestMatchIndex = 0;
    for (let i = 0; i < targetStrings.length; i++) {
        const currentTargetString = targetStrings[i];
        const currentRating = compareTwoStrings(mainString, currentTargetString);
        ratings.push({ target: currentTargetString, rating: currentRating });
        if (currentRating > ratings[bestMatchIndex].rating) {
            bestMatchIndex = i;
        }
    }
    return {
        ratings: ratings,
        bestMatch: ratings[bestMatchIndex],
        bestMatchIndex: bestMatchIndex,
    };
}
exports.findBestMatch = findBestMatch;
function compareTwoStrings(first, second) {
    if (!second)
        throw TypeError(`Expectados 2 argumentos y obtenido solo 1.`);
    if (typeof first !== "string" || typeof second !== "string")
        throw TypeError(`Esta función solo acepta dos strings en los dos argumentos que requiere.`);
    first = first.replace(/\s+/g, "");
    second = second.replace(/\s+/g, "");
    if (first === second)
        return 1;
    if (first.length < 2 || second.length < 2)
        return 0;
    let firstBigrams = new Map();
    for (let i = 0; i < first.length - 1; i++) {
        const bigram = first.substring(i, i + 2);
        const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;
        firstBigrams.set(bigram, count);
    }
    let intersectionSize = 0;
    for (let i = 0; i < second.length - 1; i++) {
        const bigram = second.substring(i, i + 2);
        const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;
        if (count > 0) {
            firstBigrams.set(bigram, count - 1);
            intersectionSize++;
        }
    }
    return (2.0 * intersectionSize) / (first.length + second.length - 2);
}
exports.compareTwoStrings = compareTwoStrings;
function areArgsValid(mainString, targetStrings) {
    if (typeof mainString !== "string")
        return false;
    if (!Array.isArray(targetStrings))
        return false;
    if (!targetStrings.length)
        return false;
    if (targetStrings.find(function (s) {
        return typeof s !== "string";
    }))
        return false;
    return true;
}
exports.areArgsValid = areArgsValid;
function separateArray(array, size) {
    if (!Array.isArray(array))
        throw TypeError(`El primer argumento debe ser un array.`);
    if (typeof size !== "number")
        throw TypeError(`El segundo argumento debe ser un número.`);
    if (size < 1)
        throw TypeError(`El segundo argumento debe ser mayor que 0.`);
    let result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}
exports.separateArray = separateArray;
