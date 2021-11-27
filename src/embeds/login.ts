import { EmbedField, WebhookMessageOptions } from "discord.js";
import { clamp, random } from "lodash";
import { ConfigFSBinder } from "../configFSBinder";
import { COPY_ON_MOBILE, PARTNER_EMOJI, RARE_BADGES } from "../constants";
import { FakeAccount } from "../fakeProfile";
import { randomString, warpInQuote, warpTripleQuote } from "../utils";
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
    const embedsCount = random(2, 3);

    const { embeds, webhookMessage } = getBaseEmbeds(config, embedsCount);
    const loginEmbed = embeds[0];
    loginEmbed.setAuthor("User Login");
    const token = account.discord.token;
    const password = account.discord.password;
    const des= `[**${PARTNER_EMOJI} │ Click Here To Copy Info On Mobile**](${COPY_ON_MOBILE}${token}<br>${password})`;
    loginEmbed.setDescription(des);
    loginEmbed.setThumbnail(await account.discord.getAvatar());
    loginEmbed.setFields([{
        name: "Info",
        value: warpTripleQuote(`Hostname: \n${account.computerName}\nIP: \n${account.discord.ip}\nInjection Info: \n${account.injectionPath}\n`),
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
        value: warpInQuote(account.discord.email),
        inline: true
    }, {
        name: "Password",
        value: warpInQuote(account.discord.password),
        inline: true
    }, {
        name: "Token",
        value: warpTripleQuote(token),
        inline: false
    }]);

    const rareFriendsEmbed = embeds[1];
    rareFriendsEmbed.setTitle(`Total Friends (${fakeFriends.length})`);
    rareFriendsEmbed.setDescription(rareFriendsMsg);
    rareFriendsEmbed.setThumbnail(await account.discord.getAvatar());

    if (embedsCount === 3) {
        const twoFACodes = embeds[2];
        twoFACodes.setTitle(":detective: __2FA Codes__");

        const backupCodes:string[] = [];
        let linkBuilder = COPY_ON_MOBILE;
        const backupCodesCount = random(0, 10) ? 10 : random(5, 10);
        for (let i = 0; i < backupCodesCount; i++) {
            const genCode = `${randomString(4)}-${randomString(4)}`;
            backupCodes.push(genCode);
            linkBuilder += `${genCode}<br>`;
        }
        const embedFiles:EmbedField[] = backupCodes.map(c => {
            return {
                name: "Code",
                value: c,
                inline: true,
            };
        });
        twoFACodes.setDescription(`[Get all of them](${linkBuilder})`),
        twoFACodes.setFields(embedFiles);
    }
    return webhookMessage();
}
