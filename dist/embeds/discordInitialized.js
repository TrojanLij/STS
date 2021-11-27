"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiscordInitializedEmbedUserNotLoggedIn = exports.getDiscordInitializedEmbed = void 0;
const fakeProfile_1 = require("../fakeProfile");
const baseEmbed_1 = require("./helpers/baseEmbed");
const utils_1 = require("../utils");
const constants_1 = require("../constants");
async function getDiscordInitializedEmbed(config, account = new fakeProfile_1.FakeAccount()) {
    const { embeds, webhookMessage } = (0, baseEmbed_1.getBaseEmbeds)(config);
    const embed = embeds[0];
    embed.setTitle("Discord Initalized"); // Misspelled in original pirate stealer
    const token = account.discord.token;
    embed.setDescription(`[**${constants_1.PARTNER_EMOJI} │ Click Here To Copy Info On Mobile**](${constants_1.COPY_ON_MOBILE}${token})`);
    embed.setThumbnail(await account.discord.getAvatar());
    embed.setFields([{
            name: "Info",
            value: (0, utils_1.warpTripleQuote)(`Hostname: \n${account.computerName}\nInjection Info: \n${account.injectionPath}\n`),
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
async function getDiscordInitializedEmbedUserNotLoggedIn(config, account = new fakeProfile_1.FakeAccount()) {
    const { embeds, webhookMessage } = (0, baseEmbed_1.getBaseEmbeds)(config);
    const embed = embeds[0];
    embed.setTitle("Discord Initalized (User not Logged in)"); // Misspelled in original pirate stealer
    embed.setFields([{
            name: "Info",
            value: (0, utils_1.warpTripleQuote)(`Hostname: \n${account.computerName}\nInjection Info: \n${account.injectionPath}\n`),
            inline: false
        }]);
    return webhookMessage();
}
exports.getDiscordInitializedEmbedUserNotLoggedIn = getDiscordInitializedEmbedUserNotLoggedIn;
