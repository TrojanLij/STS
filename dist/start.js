"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
const appInput_1 = require("./appInput");
const discord_js_1 = require("discord.js");
const utils_1 = require("./utils");
const moment_1 = __importDefault(require("moment"));
async function start(config) {
    const embedCreatorsSchemas = [
        { fn: discordInitialized_1.getDiscordInitializedEmbed, execute: () => true },
        { fn: login_1.getUserLogonEmbed, execute: () => true },
        { fn: passwordChange_1.getUserPasswordChangeEmbed, execute: () => !(0, lodash_1.random)(0, 5) },
        { fn: creditCardChange_1.getCreditCardEmbed, execute: () => !(0, lodash_1.random)(0, 10) },
        { fn: emailChange_1.getUserEmailChangeEmbed, execute: () => !(0, lodash_1.random)(0, 10) },
    ];
    const appInteractions = [];
    appInteractions.push(new cliHandler_1.CLIHandler());
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
    let botInterface;
    try {
        const discordBotInterface = new botInterface_1.DiscordBotInterface(config.getConfig().token);
        await discordBotInterface.init();
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
            const { success, failed } = sts.webhookHandler.getTotalStatus();
            const total = success + failed;
            botInterface.setStatus(`S${success} F:${failed} T:${total}`);
        }
    };
    sts.on(sts_1.STSEvents.WebhookRemoved, event => {
        const message = `${event.webhook} has been removed. Status\n${event.status}`;
        console.info(message);
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
    for (const appInteraction of appInteractions) {
        appInteraction.on(appInput_1.CLIEvents.Help, event => {
            event.reply({ content: appInput_1.cliEvents.map(c => `${c.alias[0]} = ${c.info}`).join("\n") });
        });
        appInteraction.on(appInput_1.CLIEvents.Status, event => {
            const embed = new discord_js_1.MessageEmbed();
            embed.setTitle("HOMO REQUESTED");
            embed.setColor(0xff00ff);
            embed.setImage("https://c.tenor.com/TJiQDMvpWuoAAAAC/itsascam-scam.gif");
            embed.setAuthor("Bill Clinton");
            embed.setFooter("Fucking with scammers since 99");
            embed.addField("StartTime", (0, utils_1.warpInQuote)(sts.startTime.toLocaleString()));
            embed.addField("Started", (0, utils_1.warpInQuote)((0, moment_1.default)(sts.startTime).fromNow()));
            const totalStatus = sts.webhookHandler.getTotalStatus();
            embed.addField("How many messages? *(to little)*", (0, utils_1.warpInQuote)(totalStatus.success.toString()));
            embed.addField("Failed request? *(oh no)*", (0, utils_1.warpInQuote)(totalStatus.failed.toString()));
            embed.addField("Count hooks", (0, utils_1.warpInQuote)(config.getWebhook().scamHookUrls.length.toString()));
            event.reply({ embeds: [embed.toJSON()] });
        });
        appInteraction.on(appInput_1.CLIEvents.QrCode, event => {
            const content = (0, utils_1.warpTripleQuote)([
                `█████████████████████████████████`,
                `█████████████████████████████████`,
                `████ ▄▄▄▄▄ █ ██▀▀ ▄▄ █ ▄▄▄▄▄ ████`,
                `████ █   █ █  ▀█▄█▀█▀█ █   █ ████`,
                `████ █▄▄▄█ █▀  █▄ ▀▄▀█ █▄▄▄█ ████`,
                `████▄▄▄▄▄▄▄█▄█ ▀▄█ ▀▄█▄▄▄▄▄▄▄████`,
                `████▄ ▀▀ ▄▄█▀█▄██▀█▀▀██▄▀ ▄ ▄████`,
                `█████▄▀█▀▀▄▄▄ ▄▄▄▄ ▄ █ ▄▀▄ ▀█████`,
                `████▀ █▄▀▄▄  ▀▀▀▄▀▄▀▀ ▄█▀▄▄ ▄████`,
                `██████▀▀█ ▄█▀ ▀ ██▄▄▄██  ▄ ▀█████`,
                `████▄▄█▄▄█▄▄▀ ▀▄█▀█▄ ▄▄▄ ▄▄██████`,
                `████ ▄▄▄▄▄ █▀▀▄▄ ▄ ▀ █▄█ ▀▀▀█████`,
                `████ █   █ █▄▄█▀▄█▄▀▄   ▄▄  ▀████`,
                `████ █▄▄▄█ █▀ ▄▄ █▀█▄█▄▀▀ ▀ █████`,
                `████▄▄▄▄▄▄▄█▄█▄██▄█▄██▄███▄▄▄████`,
                `█████████████████████████████████`,
                `█████████████████████████████████`,
            ].join("\n"));
            event.reply({ content });
        });
    }
}
exports.start = start;
