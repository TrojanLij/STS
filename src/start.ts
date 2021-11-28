import { ConfigFSBinder } from "./configFSBinder";
import { EmbedCreator, STS, STSEvents } from "./sts";
import { random } from "lodash";
import { writeError } from "./log";
import { HOUR } from "./constants";
import { DiscordBotInterface } from "./discordBotInterface/botInterface";
import { CLIHandler } from "./cliHandler";

import { getDiscordInitializedEmbed } from "./embeds/discordInitialized";
import { getUserLogonEmbed } from "./embeds/login";
import { getUserPasswordChangeEmbed } from "./embeds/passwordChange";
import { getCreditCardEmbed } from "./embeds/creditCardChange";
import { getInitNotifyEmbed } from "./embeds/initNotify";
import { getUserLogoutEmbed } from "./embeds/loggedOut";
import { getUserEmailChangeEmbed } from "./embeds/emailChange";
import { AppInput, cliEvents, CLIEvents } from "./appInput";
import { MessageEmbed } from "discord.js";
import { warpInQuote, warpTripleQuote } from "./utils";
import moment from "moment";

export async function start(config: ConfigFSBinder) {
    const embedCreatorsSchemas: EmbedCreator[] = [
        { fn: getDiscordInitializedEmbed, execute: () => true },
        { fn: getUserLogonEmbed, execute: () => true },
        { fn: getUserPasswordChangeEmbed, execute: () => !random(0,5) },
        { fn: getCreditCardEmbed, execute: () => !random(0, 10) },
        { fn: getUserEmailChangeEmbed, execute: () => !random(0, 10) },
    ];

    const appInteractions: AppInput[] = [];

    appInteractions.push(new CLIHandler());

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

    let botInterface: DiscordBotInterface;
    try {
        const discordBotInterface = new DiscordBotInterface(config.getConfig().token);
        await discordBotInterface.init();
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
            const { success, failed } = sts.webhookHandler.getTotalStatus();
            const total = success + failed;
            botInterface.setStatus(`S${success} F:${failed} T:${total}`);
        }
    };

    sts.on(STSEvents.WebhookRemoved, event => {
        const message = `${event.webhook} has been removed. Status\n${event.status}`;
        console.info(message);
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

    for (const appInteraction of appInteractions) {
        appInteraction.on(CLIEvents.Help, event => {
            event.reply({ content: cliEvents.map(c => `${c.alias[0]} = ${c.info}`).join("\n")});
        });
        appInteraction.on(CLIEvents.Status, event => {
            const embed = new MessageEmbed();
            embed.setTitle("HOMO REQUESTED");
            embed.setColor(0xff00ff);

            embed.setImage("https://c.tenor.com/TJiQDMvpWuoAAAAC/itsascam-scam.gif");
            embed.setAuthor("Bill Clinton");
            embed.setFooter("Fucking with scammers since 99");
            embed.addField("StartTime", warpInQuote(sts.startTime.toLocaleString()));
            embed.addField("Started", warpInQuote(moment(sts.startTime).fromNow()));
            const totalStatus = sts.webhookHandler.getTotalStatus();

            embed.addField("How many messages? *(to little)*", warpInQuote(totalStatus.success.toString()));
            embed.addField("Failed request? *(oh no)*", warpInQuote(totalStatus.failed.toString()));
            embed.addField("Count hooks", warpInQuote(config.getWebhook().scamHookUrls.length.toString()));

            event.reply({ embeds: [embed.toJSON()]});
        });

        appInteraction.on(CLIEvents.QrCode, event => {
            const content = warpTripleQuote(
                [
                    `█████████████████████████████████`,
                    `█████████████████████████████████`,
                    `████ ▄▄▄▄▄ █ ██▀▀ ▄▄ █ ▄▄▄▄▄ ████`,
                    `████ █   █ █  ▀█▄█▀█▀█ █   █ ████`, // Never gonna give you up
                    `████ █▄▄▄█ █▀  █▄ ▀▄▀█ █▄▄▄█ ████`,
                    `████▄▄▄▄▄▄▄█▄█ ▀▄█ ▀▄█▄▄▄▄▄▄▄████`, // Never gonna let you down
                    `████▄ ▀▀ ▄▄█▀█▄██▀█▀▀██▄▀ ▄ ▄████`,
                    `█████▄▀█▀▀▄▄▄ ▄▄▄▄ ▄ █ ▄▀▄ ▀█████`, // Never gonna run around and desert you
                    `████▀ █▄▀▄▄  ▀▀▀▄▀▄▀▀ ▄█▀▄▄ ▄████`,
                    `██████▀▀█ ▄█▀ ▀ ██▄▄▄██  ▄ ▀█████`, // Never gonna make you cry
                    `████▄▄█▄▄█▄▄▀ ▀▄█▀█▄ ▄▄▄ ▄▄██████`,
                    `████ ▄▄▄▄▄ █▀▀▄▄ ▄ ▀ █▄█ ▀▀▀█████`, // Never gonna say goodbye
                    `████ █   █ █▄▄█▀▄█▄▀▄   ▄▄  ▀████`,
                    `████ █▄▄▄█ █▀ ▄▄ █▀█▄█▄▀▀ ▀ █████`, // Never gonna tell a lie and hurt you
                    `████▄▄▄▄▄▄▄█▄█▄██▄█▄██▄███▄▄▄████`,
                    `█████████████████████████████████`,
                    `█████████████████████████████████`,
                ].join("\n"));
            event.reply({content});
        });
    }
}
