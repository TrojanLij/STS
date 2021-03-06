import moment from "moment";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import * as path from "path";

export const ORIGINAL_METHODS = {
    log: console.log,
    info: console.info,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
};

async function dumpError(data: any) {
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

export function prettifyConsoleOutput() {

    const createConsoleOutput = (method: keyof typeof ORIGINAL_METHODS ) => {
        if (!ORIGINAL_METHODS[method]) {
            throw new Error(`Method ${method} is not overridable`);
        }
        //@ts-ignore
        console[method as any] = (...args) => {
            if (method === "debug") {
                if (!DEVELOPMENT) {
                    return;
                }
            }

            ORIGINAL_METHODS[method](...[
                `[${getFormattedDate()}]`,
                `[${method}]`,
                ...args,
            ]);
        };
    };

    for (const method of Object.keys(ORIGINAL_METHODS)) {
        createConsoleOutput(method as any);
    }
}

export async function writeError(error: any, data?: string) {
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
    ];
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

function toString(obj: any): string {
    const set = new Set();
    const toStringInternal = (obj: any): string => {
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
                        set.add(o);
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
                : toStringInternal(obj[key]);
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
