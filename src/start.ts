import { ConfigFSBinder } from "./configFSBinder";
import { EmbedCreator, STS, STSEvents } from "./sts";

import { getDiscordInitializedEmbed } from "./embeds/discordInitialized";
import { getUserLogonEmbed } from "./embeds/login";
import { getUserPasswordChangeEmbed } from "./embeds/passwordChange";
import { random } from "lodash";
import { writeError } from "./log";

export async function start(config: ConfigFSBinder) {
    const embedCreators: EmbedCreator[] = [
        { fn: getDiscordInitializedEmbed, execute: () => true },
        { fn: getUserLogonEmbed, execute: () => true },
        { fn: getUserPasswordChangeEmbed, execute: () => !!random(0, 1) },
    ]

    const sendToReportWebhook = (content: string) => {
        const webhookUrl = config.getWebhook().reportHookUrl;
        if (webhookUrl){
            sts.webhookHandler.send(webhookUrl, {content});
        }
    }

    const sts = new STS(config, embedCreators);
    sts.on(STSEvents.WebhookRemoved, event => {
        const message = `${event.webhook} has been removed. Status\n${event.status}`;
        console.info(message);
        sendToReportWebhook(message);
    });
    
    sts.on(STSEvents.onFailure, async event => {
        const error = await writeError(event.axiosError, "STS fail");
        console.error(error);
        sendToReportWebhook(error);
    });

    sts.on(STSEvents.onSuccess, async event => {
        console.debug("sent", sts.webhookHandler.getWebhookStats(event.webhook));
    });

    sts.tick();


    // if (DEVELOPMENT) {
    //     console.log(config.getConfig(), config.getWebhook());
    // }
}
