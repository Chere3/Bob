/**
 * @method findBestMatch | Devuelve el mejor match de una palabra en un array.
 * @param {string} word | Palabra a buscar.
 * @param {string[]} array | Array donde buscar.
 * @return {string} El mejor match.
 * @author Cheree
 * @example
 * findBestMatch("hello", ["hello", "hi", "hey"]);
 */

export function findBestMatch(mainString: string, targetStrings: string[]) {
  if (!areArgsValid(mainString, targetStrings))
    throw TypeError(
      `Los argumentos dados son incorrectos. Por favor revisa la funcion e intenta de nuevo más tarde.`
    );

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

/**
 * @method compareTwoStrings | Compara dos strings. y devuelve el mejor match.
 * @param {string} mainString | Primer string.
 * @param {string} targetString | Segundo string.
 * @return {number} El mejor match.
 * @author Cheree
 * @example
 * compareTwoStrings("hello", "hello");
 */

export function compareTwoStrings(first: string, second: string) {
  if (!second) throw TypeError(`Expectados 2 argumentos y obtenido solo 1.`);
  if (typeof first !== "string" || typeof second !== "string")
    throw TypeError(
      `Esta función solo acepta dos strings en los dos argumentos que requiere.`
    );

  first = first.replace(/\s+/g, "");
  second = second.replace(/\s+/g, "");

  if (first === second) return 1; // identical or empty
  if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

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

/**
 * @method areArgsValid | Comprueba que los argumentos dados son correctos.
 * @param {string} mainString | Primer string.
 * @param {string[]} targetStrings | Segundo string.
 * @return {boolean} Si los argumentos son correctos o no.
 * @author Cheree
 * @example
 * areArgsValid("hello", ["hello", "hi", "hey"]);
 */

export function areArgsValid(mainString: string, targetStrings: string[]) {
  if (typeof mainString !== "string") return false;
  if (!Array.isArray(targetStrings)) return false;
  if (!targetStrings.length) return false;
  if (
    targetStrings.find(function (s) {
      return typeof s !== "string";
    })
  )
    return false;
  return true;
}


/**
 * @method separateArray | Separa un array en varios arrays de un tamaño dado.
 * @param {string[]} array | Array a separar.
 * @param {number} size | Tamaño de cada array.
 * @return {string[]} Los arrays separados.
 */

export function separateArray(array: any[], size: number) {
  if (!Array.isArray(array)) throw TypeError(`El primer argumento debe ser un array.`);
  if (typeof size !== "number") throw TypeError(`El segundo argumento debe ser un número.`);
  if (size < 1) throw TypeError(`El segundo argumento debe ser mayor que 0.`);

  let result: any[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}