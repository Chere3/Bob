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
    if (args.startsWith("#")) {
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
 * @method timeDiference Calcula la diferencia de tiempo entre dos fechas y las pone en tiempo relativo
 * @param {Date} date1
 * @param {Date} date2
 * @returns {string}
 * @example
 * timeDiference(Date.now(), 23981083921839132)
 */

export function timeDifference(time1: number, time2: number) {
  var second = 1000;
  var minute = second * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var week = day * 7;
  var month = day * 30;
  var year = day * 365;
  var decade = year * 10;
  var century = year * 100;
  var millenium = year * 1000;

  var delta = time1 - time2;

  if (delta < second) return "Justo ahora.";
  if (delta < minute) return `hace ${Math.round(delta / second)} segundos.`;
  if (delta < hour) return `hace ${Math.round(delta / minute)} minutos.`;
  if (delta < day) return `hace ${Math.round(delta / hour)} horas.`;
  if (delta < week) return `hace ${Math.round(delta / day)} días.`;
  if (delta < month) return `hace ${Math.round(delta / week)} semanas.`;
  if (delta < year) return `hace ${Math.round(delta / month)} meses.`;
  if (delta < decade) return `hace ${Math.round(delta / year)} años.`;
  if (delta < century) return `hace ${Math.round(delta / decade)} décadas.`;
  if (delta < millenium) return `hace ${Math.round(delta / century)} siglos.`;
}
