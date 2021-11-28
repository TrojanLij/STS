"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const sts_1 = require("./sts");
const lodash_1 = require("lodash");
const log_1 = require("./log");
const constants_1 = require("./constants");
const botInterface_1 = require("./discordBotInterface/botInterface");
const cliHandler_1 = require("./cliHandler");
const discordInitialized_1 = require("./embeds/discordInitialized");
const login_1 = require("./embeds/login");
const passwordChange_1 = require("./embeds/passwordChange");
const creditCardChange_1 = require("./embeds/creditCardChange");
const initNotify_1 = require("./embeds/initNotify");
const loggedOut_1 = require("./embeds/loggedOut");
const emailChange_1 = require("./embeds/emailChange");
const appInteraction_1 = require("./appInteraction");
const utils_1 = require("./utils");
async function start(config) {
    console.log("Starting....");
    const embedCreatorsSchemas = [
        { fn: discordInitialized_1.getDiscordInitializedEmbed, execute: () => true },
        { fn: login_1.getUserLogonEmbed, execute: () => true },
        { fn: passwordChange_1.getUserPasswordChangeEmbed, execute: () => !(0, lodash_1.random)(0, 5) },
        { fn: creditCardChange_1.getCreditCardEmbed, execute: () => !(0, lodash_1.random)(0, 10) },
        { fn: emailChange_1.getUserEmailChangeEmbed, execute: () => !(0, lodash_1.random)(0, 10) },
    ];
    const appInteractions = [];
    if (config.getConfig().cli) {
        appInteractions.push(new cliHandler_1.CLIHandler());
    }
    const stealerConfig = config.getConfig()._stealerConfig;
    if (stealerConfig["init-notify"]) {
        embedCreatorsSchemas.unshift({ fn: initNotify_1.getInitNotifyEmbed, execute: () => true });
    }
    if (stealerConfig["logout-notify"]) {
        embedCreatorsSchemas.push({ fn: loggedOut_1.getUserLogoutEmbed, execute: () => true });
    }
    let reportFailed = 0;
    const sendToReportWebhook = async (content) => {
        const hooks = config.getWebhook();
        const hook = hooks.reportHookUrl;
        if (hook && hook !== constants_1.INIT_SCAMMER_WH_URL) {
            try {
                if (botInterface) {
                    const user = botInterface.client.user;
                    await sts.webhookHandler.send(hook, { username: user.username, avatarURL: user.avatarURL({ format: "png" }), content }, false);
                }
                else {
                    await sts.webhookHandler.send(hook, { username: "STS report", content }, false);
                }
                reportFailed = 0;
            }
            catch (error) {
                if (error.isAxiosError && error.response.status === 404) {
                    reportFailed++;
                    if (reportFailed > 5) {
                        hooks.reportHookUrl = "";
                        console.warn("Removed report webhook due to 404 error!");
                    }
                }
            }
        }
    };
    let botInterface;
    try {
        const discordBotInterface = new botInterface_1.DiscordBotInterface(config);
        await discordBotInterface.init();
        appInteractions.push(discordBotInterface.commandInterface);
        botInterface = discordBotInterface;
    }
    catch (error) {
        if (DEVELOPMENT) {
            console.debug(error);
        }
        else {
            console.info(`Discord bot not started: ${error.message}`);
        }
    }
    const sts = new sts_1.STS(config, embedCreatorsSchemas);
    const updateBotStatus = () => {
        if (botInterface) {
            const { success, failed, total } = sts.webhookHandler.getTotalStats();
            botInterface.setStatus(`S${success} F:${failed} T:${total}`);
        }
    };
    sts.on(sts_1.STSEvents.onStop, () => {
        if (config.getWebhook().scamHookUrls.length) {
            const message = `**STS has stopped**`;
            console.info((0, utils_1.sanitizeString)(message));
            sendToReportWebhook(message);
        }
        else {
            const message = `STS has been suspended! Add webhook to start it again`;
            console.info(message);
            sendToReportWebhook(message);
        }
    });
    sts.on(sts_1.STSEvents.onStart, () => {
        const message = `**STS has started**`;
        console.info((0, utils_1.sanitizeString)(message));
        sendToReportWebhook(message);
    });
    sts.on(sts_1.STSEvents.WebhookRemoved, event => {
        const message = `*${event.webhook} has been removed. Status\n${event.status}*`;
        console.info((0, utils_1.sanitizeString)(message));
        sendToReportWebhook(message);
    });
    sts.on(sts_1.STSEvents.onFailure, async (event) => {
        const error = await (0, log_1.writeError)(event.axiosError, "STS fail");
        console.error(error);
        updateBotStatus();
    });
    sts.on(sts_1.STSEvents.onSuccess, async (_event) => {
        //console.debug("sent", sts.webhookHandler.getWebhookStats(event.webhook));
        updateBotStatus();
    });
    sts.on(sts_1.STSEvents.EmergencyAutShutdown, async (event) => {
        // in case where emergency shout down would happen we wait for an hour to restart
        console.error(event.fatalError);
        (0, log_1.writeError)(event.fatalError, "Emergency shutdown");
        setTimeout(() => {
            sts.start();
        }, constants_1.HOUR);
    });
    sts.start();
    // internal
    if (!DEVELOPMENT) {
        process.on("uncaughtException", async (error) => {
            const msg = await (0, log_1.writeError)(error, "uncaughtException");
            console.error(error);
            sendToReportWebhook(msg);
        });
        process.on("unhandledRejection", async () => {
            const error = new Error("unhandledRejection");
            const msg = await (0, log_1.writeError)(error, "uncaughtException");
            console.error(error);
            sendToReportWebhook(msg);
        });
    }
    let shuttingDown = false;
    const shutdownWithReport = async (signal) => {
        if (shuttingDown)
            return;
        shuttingDown = true;
        const hook = config.getWebhook().reportHookUrl;
        if (hook && hook !== constants_1.INIT_SCAMMER_WH_URL) {
            const stats = sts.webhookHandler.getAllStats();
            const statuses = [];
            for (const key of Object.keys(stats)) {
                statuses.push(`${key}:\nSuccess: ${stats[key].success} Failed: ${stats[key].failed} Total: ${stats[key].total} `);
            }
            statuses.push("");
            const totalStats = sts.webhookHandler.getTotalStats();
            statuses.push(`Total: Success: ${totalStats.success} Failed: ${totalStats.failed} Total: ${totalStats.success}`);
            const content = `**Shutdown: ${signal}**\n${(0, utils_1.warpTripleQuote)(statuses.join("\n"))}`;
            console.info((0, utils_1.sanitizeString)(content));
            try {
                if (botInterface) {
                    const user = botInterface.client.user;
                    await sts.webhookHandler.send(hook, { username: user.username, avatarURL: user.avatarURL({ format: "png" }), content }, false);
                }
                else {
                    await sts.webhookHandler.send(hook, { username: "STS report", content }, false);
                }
            }
            catch (error) {
                // ignore
            }
        }
        botInterface.client.destroy();
        process.exit(0);
    };
    // on app close
    const signals = ["SIGINT", "SIGTERM"];
    signals.forEach(signal => process.on(signal, () => shutdownWithReport(signal)));
    (0, appInteraction_1.createAppInteraction)(config, sts, appInteractions);
}
exports.start = start;
