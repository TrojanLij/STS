const moment = require("moment");
const { existsSync, mkdirSync, writeFileSync } = require("fs");
const path = require("path");

async function dumpError(data) {
  const logFolder = path.join(process.cwd(), "log");
  if (!existsSync(logFolder)) {
    mkdirSync(logFolder);
  }
  const fileName = `${Date.now()}.log`;
  const dumpPath = path.join(logFolder, fileName);
  writeFileSync(dumpPath, data);
  return fileName;
}

// for some reason this never gets resolved
// function writeFilePromise(path, data) {
//     return new Promise((resolve, reject) => {
//         writeFile(path, data, (err)=> {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve();
//             }
//         })
//     });
// }

function getFormattedDate() {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

function prettifyConsoleOutput() {
  const methods = {
    log: console.log,
    info: console.info,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
  };
  const createConsoleOutput = (method) => {
    if (!methods[method])
      throw new Error(`Method ${method} is not overridable`);
    console[method] = function (...args) {
      methods[method].apply(console, [
        `[${getFormattedDate()}]`,
        `[${method}]`,
        ...args,
      ]);
    };
  };
  createConsoleOutput("log");
  createConsoleOutput("warn");
  createConsoleOutput("error");
  createConsoleOutput("info");
  createConsoleOutput("debug");
}

async function writeError(error, data) {
  let shouldBeError = error;
  const isError =
    typeof shouldBeError === "object" &&
    typeof shouldBeError.message === "string" &&
    typeof shouldBeError.stack === "string";
  if (!isError) {
    shouldBeError = new Error(toString(error));
  }
  const stringify = [
    getFormattedDate(),
    shouldBeError.message,
    shouldBeError.stack
  ]
  if (data) {
      stringify.push(data);
  }

  try {
    const fileInfo = await dumpError(stringify.join("\n"));
    return `${shouldBeError.message}. Error came in \`${fileInfo}\``;
  } catch (error) {
    return toString(error);
  }
}

function toString(obj) {
  const set = new Set();
  const toStringInternal = (obj) => {
    switch (typeof obj) {
      case "boolean": {
        return obj === true ? `{Boolean: true}` : `[Boolean: false]`;
      }
      case "function": {
        try {
          const name = obj.name;
          const content = obj.toString;
          return `{Function: function ${name}() {\n${content}\n};`;
        } catch (error) {
          try {
            const name = obj.name;
            return `{Function: function ${name}() {\n [Native code] \n};`;
          } catch (error) {
            return `{Function: function {Unknown}() {\n [Unknown] \n};`;
          }
        }
      }
      case "number": {
        return obj.toString();
      }
      case "object": {
        if (Array.isArray(obj)) {
          return `{Array: ${obj.map((o, i) => {
            const objS = toStringInternal(o);
            const value = `\n${i}: ${objS}`;
            set.add(o, objS);
            return value;
          })}}`;
        } else {
          if (obj === null) {
            return `{null: null}`;
          }
          try {
            const keys = Object.keys(obj);
            let objBuilder = "";
            for (const key of keys) {
              set.has(obj[key]);
              const objS = set.has(obj[key])
                ? `{object: circular ref}`
                : toStringInternal(obj[key], true);
              set.add(obj[key]);
              objBuilder += `\n${key}: ${objS}`;
            }
            return objBuilder;
          } catch (error) {
            try {
              const string = JSON.stringify(obj, undefined, 2);
              return `{objJSON: ${string}}`;
            } catch (error) {
              return `{obj: __toString Error}`;
            }
          }
        }
      }
      case "symbol": {
        return `{Symbol: [Symbol]}`;
      }
      case "undefined": {
        return `{undefined: undefined}`;
      }
      case "bigint": {
        return `{Bigint: ${obj.toString()}}`;
      }
      case "string": {
        return `{string: ${obj}}`;
      }
      default: {
        return `{Unknown: Unknown}`;
      }
    }
  };
  return toStringInternal(obj);
}

module.exports.dumpError = dumpError;
module.exports.prettifyConsoleOutput = prettifyConsoleOutput;
module.exports.writeError = writeError;
