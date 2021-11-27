"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const sts_1 = require("./sts");
const discordInitialized_1 = require("./embeds/discordInitialized");
const login_1 = require("./embeds/login");
const passwordChange_1 = require("./embeds/passwordChange");
const lodash_1 = require("lodash");
const log_1 = require("./log");
async function start(config) {
    const embedCreators = [
        { fn: discordInitialized_1.getDiscordInitializedEmbed, execute: () => true },
        { fn: login_1.getUserLogonEmbed, execute: () => true },
        { fn: passwordChange_1.getUserPasswordChangeEmbed, execute: () => !!(0, lodash_1.random)(0, 1) },
    ];
    const sendToReportWebhook = (content) => {
        const webhookUrl = config.getWebhook().reportHookUrl;
        if (webhookUrl) {
            sts.webhookHandler.send(webhookUrl, { content });
        }
    };
    const sts = new sts_1.STS(config, embedCreators);
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
    sts.tick();
    // if (DEVELOPMENT) {
    //     console.log(config.getConfig(), config.getWebhook());
    // }
}
exports.start = start;
