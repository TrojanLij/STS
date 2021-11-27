"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLogonEmbed = void 0;
const lodash_1 = require("lodash");
const constants_1 = require("../constants");
const fakeProfile_1 = require("../fakeProfile");
const utils_1 = require("../utils");
const baseEmbed_1 = require("./baseEmbed");
const DISCORD_FRIEND_LIMIT = 1000;
const RARE_FRIENDS_LIMIT = 25; // Higher limit may exceed embed limits
async function getUserLogonEmbed(config, account = new fakeProfile_1.FakeAccount()) {
    const fakeFriends = [];
    let friendsCount = DISCORD_FRIEND_LIMIT;
    for (let index = 0; index < (0, lodash_1.random)(0, DISCORD_FRIEND_LIMIT * 0.01); index++) {
        friendsCount = Math.round((0, lodash_1.random)(0, 1) ? (0, lodash_1.random)(0, friendsCount) : (0, lodash_1.random)(0, Math.round(friendsCount * 0.5)));
    }
    for (let i = 0; i < (0, lodash_1.random)(0, friendsCount); i++) {
        fakeFriends.push(new fakeProfile_1.FakeAccount());
    }
    const rareFriends = [];
    for (const fakeFriend of fakeFriends) {
        for (const badge of fakeFriend.discord.badges) {
            if (constants_1.RARE_BADGES.includes(badge)) {
                rareFriends.push(fakeFriend);
                break;
            }
        }
    }
    let rareFriendsMsg = "No Rare Friends";
    if (rareFriends.length) {
        rareFriendsMsg = "";
        for (let i = 0; i < (0, lodash_1.clamp)(rareFriends.length, 0, RARE_FRIENDS_LIMIT); i++) {
            const disAcc = rareFriends[i].discord;
            rareFriendsMsg += `${disAcc.badges.join(" ")} ${disAcc.tag}`;
        }
    }
    const { embeds, webhookMessage } = (0, baseEmbed_1.getBaseEmbeds)(config, 2);
    const loginEmbed = embeds[0];
    loginEmbed.setAuthor("User Login");
    loginEmbed.setThumbnail(await account.discord.getAvatar());
    loginEmbed.setFields([{
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
        }, {
            name: "Password",
            value: (0, utils_1.warpInQuote)(account.discord.password),
            inline: true
        }, {
            name: "Token",
            value: (0, utils_1.warpTripleQuote)(account.discord.token),
            inline: false
        }]);
    const rareFriendsEmbed = embeds[1];
    rareFriendsEmbed.setTitle(`Total Friends (${fakeFriends.length})`);
    rareFriendsEmbed.setDescription(rareFriendsMsg);
    rareFriendsEmbed.setThumbnail(await account.discord.getAvatar());
    return webhookMessage();
}
exports.getUserLogonEmbed = getUserLogonEmbed;
