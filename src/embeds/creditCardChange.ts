/// <reference path="../typeFix/creditcardGenerator.d.ts"/>
import { WebhookMessageOptions } from "discord.js";
import { ConfigFSBinder } from "../configFSBinder";
import { FakeAccount } from "../fakeProfile";
import { warpTripleQuote } from "../utils";
import * as generator from "creditcard-generator";
import { random, sample } from "lodash";
import { getBaseEmbeds } from "./helpers/baseEmbed";

export async function getCreditCardEmbed(config: ConfigFSBinder, account = new FakeAccount()): Promise<WebhookMessageOptions> {
    const { embeds, webhookMessage } = getBaseEmbeds(config);
    const embed = embeds[0];
    embed.setTitle("User Credit Card Added");
    embed.setThumbnail(await account.discord.getAvatar());
    const card = generator.GenCC(sample(Object.keys(generator.Schemes)));
    const currentYear = parseInt((new Date()).getFullYear().toString().slice(2), 10);
    const expirationYear = random(currentYear, currentYear + 4);

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
    const description = [
        `**Username:**${warpTripleQuote(account.discord.tag)}`,
        `**ID:**${warpTripleQuote(account.discord.tag)}`,
        `**Email:**${warpTripleQuote(account.discord.email)}`,
        `**Nitro Type**:${warpTripleQuote(account.discord.nitro)}`,
        `**Badges:**${warpTripleQuote(account.discord.badges.join(" "))}`,
        `**Credit Card Number: **${warpTripleQuote(card[0])}`,
        `**Credit Card Expiration: **${warpTripleQuote(`${random(1, 12)}/${expirationYear}`)}`,
        `**CVC: **${warpTripleQuote(random(3).toString())}`,
        `**Country: **${warpTripleQuote(account.faker.address.country)}`,
        `**State: **${warpTripleQuote(account.faker.address.state)}`,
        `**City: **${warpTripleQuote(account.faker.address.city)}`,
        `**ZIP:**${warpTripleQuote(account.faker.address.zip)}`,
        `**Street: **${warpTripleQuote(account.faker.address.street)}`,
        `**Token:**${warpTripleQuote(account.discord.token)}`,
        `**IP: **${warpTripleQuote(account.discord.token)}`,
    ].join("\n");

    embed.setDescription(description);
    return webhookMessage();
}
