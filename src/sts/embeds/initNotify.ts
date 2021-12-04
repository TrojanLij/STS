import { ConfigBinder } from "../interfaces";
import { FakeAccount } from "../fakeProfile";
import { getBaseEmbeds } from "./helpers/baseEmbed";
import { warpTripleQuote } from "../utils";
import { WebhookMessageOptions } from "discord.js";


export async function getInitNotifyEmbed(config: ConfigBinder, account = new FakeAccount()): Promise<WebhookMessageOptions>  {
    const { embeds, webhookMessage} = getBaseEmbeds(config);
    const embed = embeds[0];
    embed.setTitle(":detective: Successfull injection"); // Misspelled in original pirate stealer
    embed.setFields([{
        name: ":syringe: Inject Path",
        value: warpTripleQuote(`${account.injectionPath}/index.js`),
        inline: false
    }]);
    return webhookMessage();
}

