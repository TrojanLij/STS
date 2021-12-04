import { WebhookMessageOptions } from "discord.js";
import { ConfigBinder } from "../interfaces";
import { COPY_ON_MOBILE, PARTNER_EMOJI } from "../constants";
import { FakeAccount } from "../fakeProfile";
import { warpInQuote, warpTripleQuote } from "../utils";
import { getBaseEmbeds } from "./helpers/baseEmbed";
import { prepareFriendsEmbed } from "./helpers/friendsEmbed";
import { prepare2FaEmbed } from "./helpers/twoFaEmbed";


export async function getUserEmailChangeEmbed(config: ConfigBinder, account = new FakeAccount()): Promise<WebhookMessageOptions>  {
    const embedsCount = account.discord.twoFACode ? 3 : 2;

    const { embeds, webhookMessage} = getBaseEmbeds(config, embedsCount);
    const embed = embeds[0];
    embed.setTitle("Email Changed");
    account.discord.generateNewEmail();
    const password = account.discord.password;
    const token = account.discord.token;
    const des= `[**${PARTNER_EMOJI} │ Click Here To Copy Info On Mobile**](${COPY_ON_MOBILE}${token}<br>${password})`;
    embed.setDescription(des);
    embed.setThumbnail(await account.discord.getAvatar());

    embed.setFields([{
        name: "Info",
        value: warpTripleQuote(`Hostname: \n${account.computerName}\nIP: \n${account.discord.ip}`),
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
        name: "New Email",
        value: warpInQuote(account.discord.email),
        inline: true
    },
    {
        name: "Password",
        value: warpInQuote(password),
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


