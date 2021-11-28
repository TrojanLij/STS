"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wiggleNumber = exports.delay = exports.sanitizeString = exports.sanitiesUnderline = exports.sanitiesAsterisk = exports.sanitiesQuotes = exports.sanitiesTripleQuotes = exports.warpInQuote = exports.warpTripleQuote = exports.quoteEscape = exports.getCommandArgs = exports.getArgsRaw = exports.isCommand = exports.getRandomIp = exports.randomString = exports.removeItem = exports.pushUniq = exports.createRare = void 0;
const random_ipv4_1 = __importDefault(require("random-ipv4"));
const lodash_1 = require("lodash");
function createRare(rareObjects) {
    const rareNumbers = rareObjects.map(r => r.rare);
    const max = Math.max.apply(null, rareNumbers);
    const filler = [];
    for (const rareObject of rareObjects) {
        for (let i = 0; i < max + 1 - rareObject.rare; i++) {
            filler.push(rareObject.data);
        }
    }
    filler.sort(() => Math.random() > 0.5 ? 1 : -1);
    return filler;
}
exports.createRare = createRare;
function pushUniq(array, item) {
    const index = array.indexOf(item);
    if (index === -1) {
        array.push(item);
        return array.length;
    }
    else {
        return index + 1;
    }
}
exports.pushUniq = pushUniq;
function removeItem(items, item) {
    const index = items.indexOf(item);
    if (index !== -1) {
        items.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
}
exports.removeItem = removeItem;
function randomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
exports.randomString = randomString;
function getRandomIp() {
    return (0, random_ipv4_1.default)("{token1}.{token2}.{token3}.{token4}", {
        token1: {
            min: 1,
            max: 254,
        },
        token2: {
            min: 0,
            max: 254,
        },
        token3: {
            min: 0,
            max: 254,
        },
        token4: {
            min: 2,
            max: 254,
        },
    });
}
exports.getRandomIp = getRandomIp;
function isCommand(msg, prefix, checker) {
    return getArgsRaw(msg.content)[0].toLowerCase() === `${prefix}${checker}`.toLowerCase();
}
exports.isCommand = isCommand;
function getArgsRaw(msg) {
    return msg.replace(/ +(?= )/g, "").split(" ");
}
exports.getArgsRaw = getArgsRaw;
function getCommandArgs(msg) {
    const args = getArgsRaw(msg.content);
    args.shift();
    return args;
}
exports.getCommandArgs = getCommandArgs;
function quoteEscape(text) {
    return text.toString().replace(/\\`/g, "`").replace(/`/g, "/\\`");
}
exports.quoteEscape = quoteEscape;
function warpTripleQuote(text) {
    return `\`\`\`${quoteEscape(text)}\`\`\``;
}
exports.warpTripleQuote = warpTripleQuote;
function warpInQuote(text) {
    return `\`${quoteEscape(text)}\``;
}
exports.warpInQuote = warpInQuote;
function sanitiesTripleQuotes(text) {
    return text.replace(/```/g, "");
}
exports.sanitiesTripleQuotes = sanitiesTripleQuotes;
function sanitiesQuotes(text) {
    return text.replace(/`/g, "");
}
exports.sanitiesQuotes = sanitiesQuotes;
function sanitiesAsterisk(text) {
    return text.replace(/\*/g, "");
}
exports.sanitiesAsterisk = sanitiesAsterisk;
function sanitiesUnderline(text) {
    return text.replace(/_/g, "");
}
exports.sanitiesUnderline = sanitiesUnderline;
function sanitizeString(text) {
    return sanitiesAsterisk(sanitiesUnderline(sanitiesQuotes(text)));
}
exports.sanitizeString = sanitizeString;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.delay = delay;
function wiggleNumber(number, max) {
    const half = max * 0.5;
    const rad = (0, lodash_1.random)(max);
    return number - half + rad;
}
exports.wiggleNumber = wiggleNumber;
