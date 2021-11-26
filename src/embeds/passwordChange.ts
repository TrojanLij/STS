import { WebhookMessageOptions } from "discord.js";
import { ConfigFSBinder } from "../configFSBinder";
import { FakeAccount } from "../fakeProfile";
import { warpInQuote, warpTripleQuote } from "../utils";
import { getBaseEmbeds } from "./baseEmbed";


export async function getUserPasswordChangeEmbed(config: ConfigFSBinder, account = new FakeAccount()): Promise<WebhookMessageOptions>  {
    const { embeds, webhookMessage} = getBaseEmbeds(config);
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
    return webhookMessage();
}


