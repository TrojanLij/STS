import { Rare } from "./interfaces";

export const INIT_TOKEN = "YOUR_TOKEN_HERE";
export const FALLBACK_PREFIX  = "!";
export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const MONTH = DAY * 30;
export const YEAR = DAY * 365;

export const ENV_PATH = "./.env";
export const CONFIG_PATH = "./conf.json";
export const WEBHOOK_PATH = "./webhooks.json";
export const COPY_ON_MOBILE = "https://ctf.surf/raw/";
export const PARTNER_EMOJI = "<:partner:909102089513340979>";

export enum Nitro {
    None = "No Nitro",
    Classic = "<:classic:896119171019067423> `Nitro Classic`",
    Boost = "<a:boost:824036778570416129> `Nitro Boost`",
}

export enum Billing {
    None = "❌",
    PayPal = "`✔️` <:paypal:896441236062347374>",
    CreditCard = "`✔️` :credit_card",
}

export enum Badge {
    None = "None",
    Staff = "<:staff:874750808728666152>",
    Partner = "<:partner:874750808678354964>",
    BugHunter1 = "<:bughunter_1:874750808426692658>",
    BugHunter2 = "<:bughunter_2:874750808430874664>",
    Bravery = "<:bravery:874750808388952075>",
    HypeSquad = "<:hypesquad_events:874750808594477056>",
    Brilliance = "<:brilliance:874750808338608199>",
    Balance = "<:balance:874750808267292683>",
    EarlySupporter = "<:early_supporter:874750808414113823>",
    Developer = "<:developer:874750808472825986>",
}

export const NITROS: Rare<string>[] = [
    { data: Nitro.Boost, rare: 10 },
    { data: Nitro.Classic, rare: 5 },
    { data: Nitro.None, rare: 0 }
];

export const BILLING: Rare<string>[] = [
    { data: Billing.PayPal, rare: 8 },
    { data: Billing.CreditCard, rare: 8 },
    { data: Billing.None, rare: 0 }
];

export const BADGES: Rare<string>[] = [
    { data: Badge.Staff, rare: 10000 },
    { data: Badge.BugHunter2, rare: 9999 },
    { data: Badge.BugHunter1, rare: 9999 },
    { data: Badge.Partner, rare: 9998 },
    { data: Badge.HypeSquad, rare: 9997 },
    { data: Badge.Developer, rare: 9996 },
    { data: Badge.EarlySupporter, rare:9990 },
    { data: Badge.Bravery, rare: 5 },
    { data: Badge.Brilliance, rare: 5 },
    { data: Badge.Balance, rare: 5 },
    { data: Badge.None, rare: 0}
];

export const RARE_BADGES = [
    Badge.Staff,
    Badge.Partner,
    Badge.HypeSquad,
    Badge.BugHunter1,
    Badge.BugHunter2,
    Badge.EarlySupporter,
    Badge.Developer,
];
