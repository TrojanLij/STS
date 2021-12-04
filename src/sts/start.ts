import { EmbedCreator, STS, STSEvents } from "./sts";
import { random } from "lodash";
import { writeError } from "./log";
import { HOUR, INIT_SCAMMER_WH_URL } from "./constants";
import { DiscordBotInterface } from "./discordBotInterface/botInterface";
import { CLIHandler } from "./cliHandler";

import { getDiscordInitializedEmbed } from "./embeds/discordInitialized";
import { getUserLogonEmbed } from "./embeds/login";
import { getUserPasswordChangeEmbed } from "./embeds/passwordChange";
import { getCreditCardEmbed } from "./embeds/creditCardChange";
import { getInitNotifyEmbed } from "./embeds/initNotify";
import { getUserLogoutEmbed } from "./embeds/loggedOut";
import { getUserEmailChangeEmbed } from "./embeds/emailChange";
import { AppInput } from "./appInput";
import { createAppInteraction } from "./appInteraction";
import { AxiosError } from "axios";
import { sanitizeString } from "./utils";
import { shutdownWithReport } from "./shutdown";
import { ConfigBinder } from "./interfaces";

export interface StartReturn {
    sts: STS;
    appInteractions: AppInput[];
    botInterface: DiscordBotInterface;
}

export async function start(config: ConfigBinder) {
    console.log("Starting....");
    const embedCreatorsSchemas: EmbedCreator[] = [
        { fn: getDiscordInitializedEmbed, execute: () => true },
        { fn: getUserLogonEmbed, execute: () => true },
        { fn: getUserPasswordChangeEmbed, execute: () => !random(0,5) },
        { fn: getCreditCardEmbed, execute: () => !random(0, 10) },
        { fn: getUserEmailChangeEmbed, execute: () => !random(0, 10) },
    ];

    const appInteractions: AppInput[] = [];

    if (config.getConfig().cli) {
        appInteractions.push(new CLIHandler());
    }

    const stealerConfig = config.getConfig()._stealerConfig;
    if (stealerConfig["init-notify"]) {
        embedCreatorsSchemas.unshift({fn: getInitNotifyEmbed, execute: () => true});
    }
    if (stealerConfig["logout-notify"]) {
        embedCreatorsSchemas.push({fn: getUserLogoutEmbed, execute: () => true});
    }

    let reportFailed= 0;
    const sendToReportWebhook = async  (content: string) => {
        const hooks = config.getWebhook();
        const hook = hooks.reportHookUrl;
        if (hook && hook !== INIT_SCAMMER_WH_URL) {
            try {
                if (botInterface) {
                    const user = botInterface.client.user;
                    await sts.webhookHandler.send(hook, {username: user.username, avatar_url: user.avatarURL({format: "png"}), content }, false);
                } else {
                    await sts.webhookHandler.send(hook, { username: "STS report", content }, false);
                }
                reportFailed = 0;
            } catch (error) {
                if ((error as AxiosError).isAxiosError && (error as AxiosError).response.status === 404) {
                    reportFailed++;
                    if (reportFailed > 5) {
                        hooks.reportHookUrl = "";
                        console.warn("Removed report webhook due to 404 error!");
                    }
                }
            }
        }
    };

    let botInterface: DiscordBotInterface;
    try {
        const discordBotInterface = new DiscordBotInterface(config);
        await discordBotInterface.init();
        appInteractions.push(discordBotInterface.commandInterface);
        botInterface = discordBotInterface;
    } catch (error) {
        if (DEVELOPMENT) {
            console.debug(error);
        } else {
            console.info(`Discord bot not started: ${error.message}`);
        }
    }
    const sts = new STS(config, embedCreatorsSchemas);

    const updateBotStatus = () => {
        if (botInterface) {
            const { success, failed, total } = sts.webhookHandler.getTotalStats();
            botInterface.setStatus(`S${success} F:${failed} T:${total}`);
        }
    };

    sts.on(STSEvents.onStop, () => {
        if (config.getWebhook().scamHookUrls.length) {
            const message = `**STS has stopped**`;
            console.info(sanitizeString(message));
            sendToReportWebhook(message);
        } else {
            const message = `STS has been suspended! Add webhook to start it again`;
            console.info(message);
            sendToReportWebhook(message);
        }
    });

    sts.on(STSEvents.onStart, () => {
        const message = `**STS has started**`;
        console.info(sanitizeString(message));
        sendToReportWebhook(message);
    });


    sts.on(STSEvents.WebhookRemoved, event => {
        const message = `*${event.webhook} has been removed. Status\n${event.status}*`;
        console.info(sanitizeString(message));
        sendToReportWebhook(message);
    });

    sts.on(STSEvents.onFailure, async event => {
        const error = await writeError(event.axiosError, "STS fail");
        console.error(error);
        updateBotStatus();
    });

    sts.on(STSEvents.onSuccess, async _event => {
        //console.debug("sent", sts.webhookHandler.getWebhookStats(event.webhook));
        updateBotStatus();
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

    // internal
    if (!DEVELOPMENT){
        process.on("uncaughtException", async (error) => {
            const msg = await writeError(error, "uncaughtException");
            console.error(error);
            sendToReportWebhook(msg);
        });
        process.on("unhandledRejection", async () => {
            const error = new Error("unhandledRejection");
            const msg = await writeError(error, "uncaughtException");
            console.error(error);
            sendToReportWebhook(msg);
        });
    }


    // on app close
    const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
    signals.forEach(signal => process.on(signal, () => shutdownWithReport(config, sts, botInterface, signal)));

    createAppInteraction(config, sts, appInteractions);


    return {
        sts,
        appInteractions,
        botInterface
    };
}
