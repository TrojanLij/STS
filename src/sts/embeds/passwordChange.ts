import { WebhookMessageOptions } from "discord.js";
import { COPY_ON_MOBILE, PARTNER_EMOJI } from "../constants";
import { FakeAccount } from "../fakeProfile";
import { ConfigBinder } from "../interfaces";
import { warpInQuote, warpTripleQuote } from "../utils";
import { getBaseEmbeds } from "./helpers/baseEmbed";
import { prepareFriendsEmbed } from "./helpers/friendsEmbed";
import { prepare2FaEmbed } from "./helpers/twoFaEmbed";


export async function getUserPasswordChangeEmbed(config: ConfigBinder, account = new FakeAccount()): Promise<WebhookMessageOptions>  {
    const embedsCount = account.discord.twoFACode ? 3 : 2;

    const { embeds, webhookMessage} = getBaseEmbeds(config, embedsCount);
    const embed = embeds[0];
    embed.setTitle("Password Changed");
    const oldPassword = account.discord.password;
    embed.setThumbnail(await account.discord.getAvatar());
    account.discord.generatePassword();
    const newPassword = account.discord.password;
    const token = account.discord.token;
    const des= `[**${PARTNER_EMOJI} │ Click Here To Copy Info On Mobile**](${COPY_ON_MOBILE}${token}<br>${newPassword})`;
    embed.setDescription(des);

    embed.setFields([{
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
    },
    {
        name: "Old Password",
        value: warpInQuote(oldPassword),
        inline: true,
    },
    {
        name: "New Password",
        value: warpInQuote(newPassword),
        inline: true,
    },
    {
        name: "Token",
        value: warpTripleQuote(account.discord.token),
        inline: false,
    },
    ]);

    await prepareFriendsEmbed(embeds[1], account);
    if (account.discord.twoFACode) {
        prepare2FaEmbed(embeds[2], account.discord.twoFACode);
    }

    return webhookMessage();
}


