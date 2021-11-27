"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareFriendsEmbed = void 0;
const lodash_1 = require("lodash");
const constants_1 = require("../../constants");
const RARE_FRIENDS_LIMIT = 25; // Longer might exceed the embed limit
async function prepareFriendsEmbed(embed, account) {
    const rareFriends = [];
    for (const fakeFriend of account.discord.friends) {
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
    embed.setTitle(`Total Friends (${account.discord.friends.length})`);
    embed.setDescription(rareFriendsMsg);
    embed.setThumbnail(await account.discord.getAvatar());
}
exports.prepareFriendsEmbed = prepareFriendsEmbed;
