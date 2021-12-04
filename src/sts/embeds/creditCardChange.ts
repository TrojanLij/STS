/// <reference path="../typeFix/creditcardGenerator.d.ts"/>
import { WebhookMessageOptions } from "discord.js";
import { ConfigBinder } from "../interfaces";
import { FakeAccount } from "../fakeProfile";
import { warpTripleQuote } from "../utils";
import { getBaseEmbeds } from "./helpers/baseEmbed";

export async function getCreditCardEmbed(config: ConfigBinder, account = new FakeAccount()): Promise<WebhookMessageOptions> {
    const { embeds, webhookMessage } = getBaseEmbeds(config);
    const embed = embeds[0];
    embed.setTitle("User Credit Card Added");
    embed.setThumbnail(await account.discord.getAvatar());
    /* original pirate stealer code formatted
        "**Username:**```\" + c.username + \"#\" + c.discriminator + \"```"
        **ID:**```\" + c.id + \"```"
        **Email:**```\" + c.email + \"```"
        **Nitro Type:**```\" + GetNitro(c.premium_type) + \"```"
        **Badges:**```\" + GetBadges(c.flags) + \"```"
        **Credit Card Number: **```\" + e + \"```"
        **Credit Card Expiration: **```\" + n + \"/\" + r + \"```"
        **CVC: **```\" + t + \"```"
        **Country: **```\" + l + \"```"
        **State: **```\" + o + \"```"
        "**City: **```\" + s + \"```"
        "**ZIP:**```\" + i + \"```"
        "**Street: **```\" + a + \"```"
        "**Token:**```\" + p + \"```"
        "**IP: **```\" + d + \"```\""
    */

    const card = account.discord.addCreditCard();
    const description = [
        `**Username:**${warpTripleQuote(account.discord.tag)}`,
        `**ID:**${warpTripleQuote(account.discord.id)}`,
        `**Email:**${warpTripleQuote(account.discord.email)}`,
        `**Nitro Type**:${warpTripleQuote(account.discord.nitro) }`,
        `**Badges:**${warpTripleQuote(account.discord.badges.join(" ")) }`,
        `**Credit Card Number: **${warpTripleQuote(card.id)}`,
        `**Credit Card Expiration: **${warpTripleQuote(card.expiration)}`,
        `**CVC: **${warpTripleQuote(card.cvc)}`,
        `**Country: **${warpTripleQuote(account.faker.address.country)}`,
        `**State: **${warpTripleQuote(account.faker.address.state)}`,
        `**City: **${warpTripleQuote(account.faker.address.city)}`,
        `**ZIP:**${warpTripleQuote(account.faker.address.zip)}`,
        `**Street: **${warpTripleQuote(account.faker.address.street)}`,
        `**Token:**${warpTripleQuote(account.discord.token)}`,
        `**IP: **${warpTripleQuote(account.discord.ip)}`,
    ].join("\n");

    embed.setDescription(description);
    return webhookMessage();
}
