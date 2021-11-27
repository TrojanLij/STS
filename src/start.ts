import { ConfigFSBinder } from "./configFSBinder";
import { EmbedCreator, STS, STSEvents } from "./sts";

import { getDiscordInitializedEmbed } from "./embeds/discordInitialized";
import { getUserLogonEmbed } from "./embeds/login";
import { getUserPasswordChangeEmbed } from "./embeds/passwordChange";
import { getCreditCardEmbed } from "./embeds/creditCardChange";
import { getInitNotifyEmbed } from "./embeds/initNotify";
import { getUserLogoutEmbed } from "./embeds/loggedOut";
import { getUserEmailChangeEmbed } from "./embeds/emailChange";
import { random } from "lodash";
import { writeError } from "./log";
import { HOUR } from "./constants";

export async function start(config: ConfigFSBinder) {
    const embedCreatorsSchemas: EmbedCreator[] = [
        { fn: getDiscordInitializedEmbed, execute: () => true },
        { fn: getUserLogonEmbed, execute: () => true },
        { fn: getUserPasswordChangeEmbed, execute: () => !random(0,5) },
        { fn: getCreditCardEmbed, execute: () => !random(0, 10) },
        { fn: getUserEmailChangeEmbed, execute: () => !random(0, 10) },
    ];

    const stealerConfig = config.getConfig()._stealerConfig;
    if (stealerConfig["init-notify"]) {
        embedCreatorsSchemas.unshift({fn: getInitNotifyEmbed, execute: () => true});
    }
    if (stealerConfig["logout-notify"]) {
        embedCreatorsSchemas.push({fn: getUserLogoutEmbed, execute: () => true});
    }

    const sendToReportWebhook = (content: string) => {
        const webhookUrl = config.getWebhook().reportHookUrl;
        if (webhookUrl){
            sts.webhookHandler.send(webhookUrl, {content});
        }
    };

    const sts = new STS(config, embedCreatorsSchemas);
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

    sts.on(STSEvents.EmergencyAutShutdown, async event => {
        // in case where emergency shout down would happen we wait for an hour to restart
        console.error(event.fatalError);
        writeError(event.fatalError, "Emergency shutdown");

        setTimeout(() => {
            sts.start();
        }, HOUR);
    });
    sts.start();


    // if (DEVELOPMENT) {
    //     console.log(config.getConfig(), config.getWebhook());
    // }
}
