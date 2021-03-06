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
    return getArgsRaw(msg.content)[0].toLowerCase() === `${prefix}${checker}`.toLowerCase();
}

export function getArgsRaw(msg: string) {
    return msg.replace(/ +(?= )/g,"").split(" ");
}

export function getCommandArgs(msg: Message) {
    const args = getArgsRaw(msg.content);
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
export function sanitiesTripleQuotes(text: string) {
    return text.replace(/```/g, "");
}
export function sanitiesQuotes(text: string) {
    return text.replace(/`/g, "");
}
export function sanitiesAsterisk(text: string) {
    return text.replace(/\*/g, "");
}
export function sanitiesUnderline(text: string) {
    return text.replace(/_/g, "");
}
export function sanitizeString(text: string) {
    return sanitiesAsterisk(sanitiesUnderline(sanitiesQuotes(text)));
}
export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function wiggleNumber(number: number, max: number) {
    const half = max * 0.5;
    const rad = random(max);
    return number - half + rad;
}
