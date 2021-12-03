import superagent from "superagent";

/**
 * @method Separa el texto en base a los digitos que se le dan
 * @param {string} texto
 * @param {number} digitos
 * @returns {string[]}
 * @example
 * separeTexto('123456789', 3)
 */

export function separeTexto(texto: string, digitos: number) {
  let textoSeparado: string[] = [];
  let textoSeparadoTemp: string = "";
  let contador: number = 0;
  for (let i = 0; i < texto.length; i++) {
    textoSeparadoTemp += texto[i];
    contador++;
    if (contador === digitos) {
      textoSeparado.push(textoSeparadoTemp);
      textoSeparadoTemp = "";
      contador = 0;
    }
  }
  if (textoSeparadoTemp !== "") {
    textoSeparado.push(textoSeparadoTemp);
  }
  return textoSeparado;
}

/**
 * @method parseQuery Parsea una query string y la separa por flags y args.
 * @param {string} query
 * @returns {object}
 * @example
 * parseQuery('base --silent')
 */

export function parseQuery(queries: string[]) {
  interface queries {
    query: string[];
    flags: string[];
  }

  const query = [];
  const flags = [];

  for (const args of queries) {
    if (args.startsWith("&")) {
      flags.push(args.slice(2).toLowerCase());
    } else {
      query.push(args);
    }
  }

  return { query, flags } as queries;
}

/**
 * @method parseEval Evalua una query string y la y detecta si es promesa y devuelve eso mismo.
 * @param {string} query
 * @returns {Promise<any>}
 * @example
 * parseEval('base --silent')
 */

export async function parseEval(query) {
  const isPromise =
    query instanceof Promise &&
    typeof query.then == "function" &&
    typeof query.catch == "function";

  if (isPromise) {
    query = await query;

    return {
      evaled: query,
      type: `Promise<${parseType(query)}>`,
    };
  }

  return { evaled: query, type: parseType(query) };
}

/**
 * @method parseType Detecta el tipo de una variable y devuelve eso mismo.
 * @param {any} query
 * @returns {Promise<any>}
 * @example
 * parseType('base --silent')
 */

export function parseType(query) {
  if (query instanceof Buffer) {
    let length = Math.round(query.length / 1024 / 1024);
    let ic = "MB";

    if (!length) {
      length = Math.round(query.length / 1024);
      ic = "KB";
    }

    if (!length) {
      length = Math.round(query.length);
      ic = "Bytes";
    }

    return `Buffer(${length} ${ic})`;
  }

  return query === null || query === undefined
    ? "void"
    : query.constructor.name;
}

/**
 * @method getCleverbotText Obtiene una respuesta de cleverbot al mensaje que se le da.'
 * @param {string} text
 * @returns {Promise<string>}
 * @example
 * getCleverbotText('Hola')
 */

export async function getCleverbot(text: string) {
  const texto = formatText(text);
  const a = await superagent
    .get(`https://apiv2.spapi.ga/misc/clever?text=${texto}`)
    .catch((a) => {
      throw Error(a);
    });

  return a.body.response;
}

/**
 * @method Formatea el texto que se le da para que sea mas legible a cleverbot.
 * @param {string} text
 * @returns {string}
 */

export function formatText(text: string) {
  // replace discord emojis
  text = text.replace(/<a?:(.*?):(\d{17,19})>/g, "$1");
  // replace discord mentions
  text = text.replace(/<@!?[0-9]{18}>/g, "");
  // replace discord roles
  text = text.replace(/<@&[0-9]{18}>/g, "");
  // replace discord channels
  text = text.replace(/<#[0-9]{18}>/g, "");
  // ignore accents
  text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return text;
}
