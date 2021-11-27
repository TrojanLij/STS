import { Rare } from "./interfaces";
import randomIpv4 from "random-ipv4";
import { Message } from "discord.js";
import { random } from "lodash";

export function createRare<D = any>(rareObjects: Rare<D>[]): D[] {
    const rareNumbers = rareObjects.map(r => r.rare);
    const max = Math.max.apply(null, rareNumbers);
    const filler: D[] = [];
    for (const rareObject of rareObjects) {
        for (let i = 0; i < max + 1  - rareObject.rare ; i++) {
            filler.push(rareObject.data);
        }
    }
    filler.sort(() => Math.random() > 0.5 ? 1 : -1);
    return filler;
}

export function pushUniq<T>(array: T[], item: T) {
    const index = array.indexOf(item);

    if (index === -1) {
        array.push(item);
        return array.length;
    } else {
        return index + 1;
    }
}

export function removeItem<T>(items: T[], item: T): boolean {
    const index = items.indexOf(item);
    if (index !== -1) {
        items.splice(index, 1);
        return true;
    } else {
        return false;
    }
}

export function randomString(length: number) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export function getRandomIp(): string {
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

export function isCommand(msg: Message, prefix: string, checker:string) {
    return getArgsRaw(msg)[0].toLowerCase() === `${prefix}${checker}`.toLowerCase();
}

export function getArgsRaw(msg: Message) {
    return msg.content.replace(/ +(?= )/g,"").split(" ");
}

export function getCommandArgs(msg: Message) {
    const args = getArgsRaw(msg);
    args.shift();
    return args;
}

export function quoteEscape(text: string) {
    return text.toString().replace(/\\`/g, "`").replace(/`/g, "/\\`");
}

export function warpTripleQuote(text: string) {
    return `\`\`\`${quoteEscape(text)}\`\`\``;
}

export function warpInQuote(text: string) {
    return `\`${quoteEscape(text)}\``;
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function wiggleNumber(number: number, max: number) {
    const half = max * 0.5;
    const rad = random(max);
    return number - half + rad;
}



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

