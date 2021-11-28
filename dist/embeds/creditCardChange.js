"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreditCardEmbed = void 0;
const fakeProfile_1 = require("../fakeProfile");
const utils_1 = require("../utils");
const baseEmbed_1 = require("./helpers/baseEmbed");
async function getCreditCardEmbed(config, account = new fakeProfile_1.FakeAccount()) {
    const { embeds, webhookMessage } = (0, baseEmbed_1.getBaseEmbeds)(config);
    const embed = embeds[0];
    embed.setTitle("User Credit Card Added");
    embed.setThumbnail(await account.discord.getAvatar());
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
    const card = account.discord.addCreditCard();
    const description = [
        `**Username:**${(0, utils_1.warpTripleQuote)(account.discord.tag)}`,
        `**ID:**${(0, utils_1.warpTripleQuote)(account.discord.id)}`,
        `**Email:**${(0, utils_1.warpTripleQuote)(account.discord.email)}`,
        `**Nitro Type**:${(0, utils_1.warpTripleQuote)(account.discord.nitro)}`,
        `**Badges:**${(0, utils_1.warpTripleQuote)(account.discord.badges.join(" "))}`,
        `**Credit Card Number: **${(0, utils_1.warpTripleQuote)(card.id)}`,
        `**Credit Card Expiration: **${(0, utils_1.warpTripleQuote)(card.expiration)}`,
        `**CVC: **${(0, utils_1.warpTripleQuote)(card.cvc)}`,
        `**Country: **${(0, utils_1.warpTripleQuote)(account.faker.address.country)}`,
        `**State: **${(0, utils_1.warpTripleQuote)(account.faker.address.state)}`,
        `**City: **${(0, utils_1.warpTripleQuote)(account.faker.address.city)}`,
        `**ZIP:**${(0, utils_1.warpTripleQuote)(account.faker.address.zip)}`,
        `**Street: **${(0, utils_1.warpTripleQuote)(account.faker.address.street)}`,
        `**Token:**${(0, utils_1.warpTripleQuote)(account.discord.token)}`,
        `**IP: **${(0, utils_1.warpTripleQuote)(account.discord.ip)}`,
    ].join("\n");
    embed.setDescription(description);
    return webhookMessage();
}
exports.getCreditCardEmbed = getCreditCardEmbed;
