"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreditCardEmbed = void 0;
const fakeProfile_1 = require("../fakeProfile");
const utils_1 = require("../utils");
const generator = __importStar(require("creditcard-generator"));
const lodash_1 = require("lodash");
const baseEmbed_1 = require("./helpers/baseEmbed");
async function getCreditCardEmbed(config, account = new fakeProfile_1.FakeAccount()) {
    const { embeds, webhookMessage } = (0, baseEmbed_1.getBaseEmbeds)(config);
    const embed = embeds[0];
    embed.setTitle("User Credit Card Added");
    embed.setThumbnail(await account.discord.getAvatar());
    const card = generator.GenCC((0, lodash_1.sample)(Object.keys(generator.Schemes)));
    const currentYear = parseInt((new Date()).getFullYear().toString().slice(2), 10);
    const expirationYear = (0, lodash_1.random)(currentYear, currentYear + 4);
    /* original pirate stealer code formatted
        "**Username:**```\" + c.username + \"#\" + c.discriminator + \"```"
        **ID:**```\" + c.id + \"```"
        **Email:**```\" + c.email + \"```"
        **Nitro Type:**```\" + GetNitro(c.premium_type) + \"```"
        **Badges:**```\" + GetBadges(c.flags) + \"```"
        **Credit Card Number: **```\" + e + \"```"
        **Credit Card Expiration: **```\" + n + \"/\" + r + \"```"
        **CVC: **```\" + t + \"```"
        **Country: **```\" + l + \"```"
        **State: **```\" + o + \"```"
        "**City: **```\" + s + \"```"
        "**ZIP:**```\" + i + \"```"
        "**Street: **```\" + a + \"```"
        "**Token:**```\" + p + \"```"
        "**IP: **```\" + d + \"```\""
    */
    const description = [
        `**Username:**${(0, utils_1.warpTripleQuote)(account.discord.tag)}`,
        `**ID:**${(0, utils_1.warpTripleQuote)(account.discord.tag)}`,
        `**Email:**${(0, utils_1.warpTripleQuote)(account.discord.email)}`,
        `**Nitro Type**:${(0, utils_1.warpTripleQuote)(account.discord.nitro)}`,
        `**Badges:**${(0, utils_1.warpTripleQuote)(account.discord.badges.join(" "))}`,
        `**Credit Card Number: **${(0, utils_1.warpTripleQuote)(card[0])}`,
        `**Credit Card Expiration: **${(0, utils_1.warpTripleQuote)(`${(0, lodash_1.random)(1, 12)}/${expirationYear}`)}`,
        `**CVC: **${(0, utils_1.warpTripleQuote)((0, lodash_1.random)(3).toString())}`,
        `**Country: **${(0, utils_1.warpTripleQuote)(account.faker.address.country)}`,
        `**State: **${(0, utils_1.warpTripleQuote)(account.faker.address.state)}`,
        `**City: **${(0, utils_1.warpTripleQuote)(account.faker.address.city)}`,
        `**ZIP:**${(0, utils_1.warpTripleQuote)(account.faker.address.zip)}`,
        `**Street: **${(0, utils_1.warpTripleQuote)(account.faker.address.street)}`,
        `**Token:**${(0, utils_1.warpTripleQuote)(account.discord.token)}`,
        `**IP: **${(0, utils_1.warpTripleQuote)(account.discord.token)}`,
    ].join("\n");
    embed.setDescription(description);
    return webhookMessage();
}
exports.getCreditCardEmbed = getCreditCardEmbed;
