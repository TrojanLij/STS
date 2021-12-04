import { ConfigBinder } from "../interfaces";
import { FakeAccount } from "../fakeProfile";
import { getBaseEmbeds } from "./helpers/baseEmbed";
import { warpInQuote, warpTripleQuote } from "../utils";
import { WebhookMessageOptions } from "discord.js";
import { COPY_ON_MOBILE, PARTNER_EMOJI } from "../constants";

export async function getDiscordInitializedEmbed(config: ConfigBinder, account = new FakeAccount()): Promise<WebhookMessageOptions>  {
    const { embeds, webhookMessage} = getBaseEmbeds(config);
    const embed = embeds[0];
    embed.setTitle("Discord Initalized"); // Misspelled in original pirate stealer
    const token = account.discord.token;
    embed.setDescription(`[**${PARTNER_EMOJI} │ Click Here To Copy Info On Mobile**](${COPY_ON_MOBILE}${token})`);
    embed.setThumbnail(await account.discord.getAvatar());
    embed.setFields([{
        name: "Info",
        value: warpTripleQuote(`Hostname: \n${account.computerName}\nInjection Info: \n${account.injectionPath}\n`),
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
        name: "Badges",
        value: account.discord.badges.join(" "),
        inline: false
    }, {
        name: "Token",
        value: warpTripleQuote(account.discord.token),
        inline: false
    }]);
    return webhookMessage();
}

export async function getDiscordInitializedEmbedUserNotLoggedIn(config: ConfigBinder, account = new FakeAccount()): Promise<WebhookMessageOptions>  {
    const { embeds, webhookMessage} = getBaseEmbeds(config);
    const embed = embeds[0];
    embed.setTitle("Discord Initalized (User not Logged in)"); // Misspelled in original pirate stealer
    embed.setFields([{
        name: "Info",
        value: warpTripleQuote(`Hostname: \n${account.computerName}\nInjection Info: \n${account.injectionPath}\n`),
        inline: false
    }]);
    return webhookMessage();
}
