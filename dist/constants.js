"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RARE_BADGES = exports.BADGES = exports.BILLING = exports.NITROS = exports.Badge = exports.Billing = exports.Nitro = exports.PARTNER_EMOJI = exports.COPY_ON_MOBILE = exports.WEBHOOK_PATH = exports.CONFIG_PATH = exports.ENV_PATH = exports.YEAR = exports.MONTH = exports.WEEK = exports.DAY = exports.HOUR = exports.MINUTE = exports.SECOND = exports.FALLBACK_PREFIX = exports.INIT_SCAMMER_WH_URL = exports.INIT_REPORT_WH_URL = exports.INIT_TOKEN = void 0;
exports.INIT_TOKEN = "YOUR_TOKEN_HERE";
exports.INIT_REPORT_WH_URL = "REPORT_WH_URL";
exports.INIT_SCAMMER_WH_URL = "SCAMMER_WH_URL";
exports.FALLBACK_PREFIX = "!";
exports.SECOND = 1000;
exports.MINUTE = exports.SECOND * 60;
exports.HOUR = exports.MINUTE * 60;
exports.DAY = exports.HOUR * 24;
exports.WEEK = exports.DAY * 7;
exports.MONTH = exports.DAY * 30;
exports.YEAR = exports.DAY * 365;
exports.ENV_PATH = "./.env";
exports.CONFIG_PATH = "./conf.json";
exports.WEBHOOK_PATH = "./webhooks.json";
exports.COPY_ON_MOBILE = "https://ctf.surf/raw/";
exports.PARTNER_EMOJI = "<:partner:909102089513340979>";
var Nitro;
(function (Nitro) {
    Nitro["None"] = "No Nitro";
    Nitro["Classic"] = "<:classic:896119171019067423> `Nitro Classic`";
    Nitro["Boost"] = "<a:boost:824036778570416129> `Nitro Boost`";
})(Nitro = exports.Nitro || (exports.Nitro = {}));
var Billing;
(function (Billing) {
    Billing["None"] = "\u274C";
    Billing["PayPal"] = "`\u2714\uFE0F` <:paypal:896441236062347374>";
    Billing["CreditCard"] = "`\u2714\uFE0F` :credit_card:";
})(Billing = exports.Billing || (exports.Billing = {}));
var Badge;
(function (Badge) {
    Badge["None"] = "None";
    Badge["Staff"] = "<:staff:874750808728666152>";
    Badge["Partner"] = "<:partner:874750808678354964>";
    Badge["BugHunter1"] = "<:bughunter_1:874750808426692658>";
    Badge["BugHunter2"] = "<:bughunter_2:874750808430874664>";
    Badge["Bravery"] = "<:bravery:874750808388952075>";
    Badge["HypeSquad"] = "<:hypesquad_events:874750808594477056>";
    Badge["Brilliance"] = "<:brilliance:874750808338608199>";
    Badge["Balance"] = "<:balance:874750808267292683>";
    Badge["EarlySupporter"] = "<:early_supporter:874750808414113823>";
    Badge["Developer"] = "<:developer:874750808472825986>";
})(Badge = exports.Badge || (exports.Badge = {}));
exports.NITROS = [
    { data: Nitro.Boost, rare: 10 },
    { data: Nitro.Classic, rare: 5 },
    { data: Nitro.None, rare: 0 }
];
exports.BILLING = [
    { data: Billing.PayPal, rare: 8 },
    { data: Billing.CreditCard, rare: 8 },
    { data: Billing.None, rare: 0 }
];
exports.BADGES = [
    { data: Badge.Staff, rare: 10000 },
    { data: Badge.BugHunter2, rare: 9999 },
    { data: Badge.BugHunter1, rare: 9999 },
    { data: Badge.Partner, rare: 9998 },
    { data: Badge.HypeSquad, rare: 9997 },
    { data: Badge.Developer, rare: 9996 },
    { data: Badge.EarlySupporter, rare: 9990 },
    { data: Badge.Bravery, rare: 5 },
    { data: Badge.Brilliance, rare: 5 },
    { data: Badge.Balance, rare: 5 },
    { data: Badge.None, rare: 0 }
];
exports.RARE_BADGES = [
    Badge.Staff,
    Badge.Partner,
    Badge.HypeSquad,
    Badge.BugHunter1,
    Badge.BugHunter2,
    Badge.EarlySupporter,
    Badge.Developer,
];
