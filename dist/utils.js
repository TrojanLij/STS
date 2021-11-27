"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wiggleNumber = exports.delay = exports.warpInQuote = exports.warpTripleQuote = exports.quoteEscape = exports.getCommandArgs = exports.getArgsRaw = exports.isCommand = exports.getRandomIp = exports.randomString = exports.removeItem = exports.pushUniq = exports.createRare = void 0;
const randomIpv4 = require("random-ipv4");
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
    return randomIpv4("{token1}.{token2}.{token3}.{token4}", {
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
    return getArgsRaw(msg)[0].toLowerCase() === `${prefix}${checker}`.toLowerCase();
}
exports.isCommand = isCommand;
function getArgsRaw(msg) {
    return msg.content.replace(/ +(?= )/g, "").split(" ");
}
exports.getArgsRaw = getArgsRaw;
function getCommandArgs(msg) {
    const args = getArgsRaw(msg);
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
// function randomNumString(n) {
//     let add = 1,
//         max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.
//     if (n > max) {
//         return generate(max) + generate(n - max);
//     }
//     max = Math.pow(10, n + add);
//     let min = max / 10; // Math.pow(10, n) basically
//     let number = Math.floor(Math.random() * (max - min + 1)) + min;
//     return ("" + number).substring(add);
// }
// function convertTimestamp(timestamp) {
//     let d = new Date(timestamp), // Convert the passed timestamp to milliseconds
//         yyyy = d.getFullYear(),
//         mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
//         dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
//         hh = d.getHours(),
//         h = hh,
//         min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
//         ampm = "AM",
//         time;
//     if (hh > 12) {
//         h = hh - 12;
//         ampm = "PM";
//     } else if (hh === 12) {
//         h = 12;
//         ampm = "PM";
//     } else if (hh == 0) {
//         h = 12;
//     }
//     // ie: 2013-02-18, 8:35 AM
//     time = yyyy + "-" + mm + "-" + dd + ", " + h + ":" + min + " " + ampm;
//     return time;
// }
// const pirateStealerConfig = {
//     logout: "%LOGOUT%",
//     "logout-notify": "%LOGOUTNOTI%",
//     "init-notify": "%INITNOTI%",
//     "embed-color": 3447704,
//     "disable-qr-code": "%DISABLEQRCODE%",
// };
