import { WebhookMessageOptions } from "discord.js";
import { clamp, random } from "lodash";
import { ConfigFSBinder } from "../configFSBinder";
import { RARE_BADGES } from "../constants";
import { FakeAccount } from "../fakeProfile";
import { warpInQuote, warpTripleQuote } from "../utils";
import { getBaseEmbeds } from "./baseEmbed";
const DISCORD_FRIEND_LIMIT = 1000;
const RARE_FRIENDS_LIMIT = 25; // Higher limit may exceed embed limits

export async function getUserLogonEmbed(config: ConfigFSBinder, account = new FakeAccount()): Promise<WebhookMessageOptions> {
    const fakeFriends: FakeAccount[] = [];
    let friendsCount = DISCORD_FRIEND_LIMIT;
    for (let index = 0; index < random(0, DISCORD_FRIEND_LIMIT * 0.01); index++) {
        friendsCount = Math.round(random(0, 1) ? random(0, friendsCount) : random(0, Math.round(friendsCount * 0.5)));
    }

    for (let i = 0; i < random(0, friendsCount); i++) {
        fakeFriends.push(new FakeAccount());
    }
    const rareFriends: FakeAccount[] = [];

    for (const fakeFriend of fakeFriends) {
        for (const badge of fakeFriend.discord.badges) {
            if((RARE_BADGES as string[]).includes(badge)) {
                rareFriends.push(fakeFriend);
                break;
            }
        }
    }
    let rareFriendsMsg = "No Rare Friends";
    if (rareFriends.length) {
        rareFriendsMsg = "";
        for (let i = 0; i < clamp(rareFriends.length, 0, RARE_FRIENDS_LIMIT); i++) {
            const disAcc = rareFriends[i].discord;
            rareFriendsMsg += `${disAcc.badges.join(" ")} ${disAcc.tag}`;
        }
    }
    const { embeds, webhookMessage } = getBaseEmbeds(config, 2);
    const loginEmbed = embeds[0];
    loginEmbed.setAuthor("User Login");
    loginEmbed.setThumbnail(await account.discord.getAvatar());
    loginEmbed.setFields([{
        name: "Info",
        value: account.injectionPath,
        inline: false
    }, {
        name: "Username",
        value: warpInQuote(account.discord.tag),
        inline: true
    }, {
        name: "ID",
        value: warpInQuote(account.discord.id),
        inline: true
    }, {
        name: "Nitro",
        value: warpInQuote(account.discord.nitro),
        inline: false
    }, {
        name: "Badges",
        value: warpInQuote(account.discord.badges.join(" ")),
        inline: false
    }, {
        name: "Billing",
        value: warpInQuote(account.discord.billing),
        inline: false
    }, {
        name: "Email",
        value: warpInQuote(account.discord.email),
        inline: true
    }, {
        name: "Password",
        value: warpInQuote(account.discord.password),
        inline: true
    }, {
        name: "Token",
        value: warpTripleQuote(account.discord.token),
        inline: false
    }]);

    const rareFriendsEmbed = embeds[1];
    rareFriendsEmbed.setTitle(`Total Friends (${fakeFriends.length})`);
    rareFriendsEmbed.setDescription(rareFriendsMsg);
    rareFriendsEmbed.setThumbnail(await account.discord.getAvatar());
    return webhookMessage();
}
