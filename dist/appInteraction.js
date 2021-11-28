"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppInteraction = void 0;
const discord_js_1 = require("discord.js");
const moment_1 = __importDefault(require("moment"));
const appInput_1 = require("./appInput");
const utils_1 = require("./utils");
const fakeProfile_1 = require("./fakeProfile");
const login_1 = require("./embeds/login");
const loggedOut_1 = require("./embeds/loggedOut");
const initNotify_1 = require("./embeds/initNotify");
const passwordChange_1 = require("./embeds/passwordChange");
const creditCardChange_1 = require("./embeds/creditCardChange");
const discordInitialized_1 = require("./embeds/discordInitialized");
function createAppInteraction(config, sts, appInteractions) {
    for (const appInteraction of appInteractions) {
        appInteraction.on(appInput_1.CLIEvents.Help, event => {
            let prefix = "";
            if (event.data) {
                if (event.data instanceof discord_js_1.Message) {
                    prefix = config.getConfig().prefix;
                }
                else if (event.data instanceof discord_js_1.Interaction) {
                    prefix = "/";
                }
            }
            event.reply({ content: (0, utils_1.warpTripleQuote)(appInput_1.cliEvents.map(c => `${prefix}${c.alias[0]} = ${c.info}`).join("\n")) });
        });
        appInteraction.on(appInput_1.CLIEvents.Status, event => {
            const embed = new discord_js_1.MessageEmbed();
            embed.setTitle("HOMO REQUESTED");
            embed.setColor(0xff00ff);
            embed.setImage("https://c.tenor.com/TJiQDMvpWuoAAAAC/itsascam-scam.gif");
            embed.setAuthor("Bill Clinton");
            embed.setFooter("Fucking with scammers since 99");
            embed.addField("StartTime", (0, utils_1.warpInQuote)(sts.startTime.toLocaleString()), true);
            embed.addField("Started", (0, utils_1.warpInQuote)((0, moment_1.default)(sts.startTime).fromNow()), true);
            const totalStatus = sts.webhookHandler.getTotalStats();
            embed.addField("How many messages? *(to little)*", (0, utils_1.warpInQuote)(totalStatus.success.toString()), true);
            embed.addField("Failed request? *(oh no)*", (0, utils_1.warpInQuote)(totalStatus.failed.toString()), true);
            embed.addField("Count hooks", (0, utils_1.warpInQuote)(config.getWebhook().scamHookUrls.length.toString()), true);
            event.reply({ embeds: [embed.toJSON()] });
        });
        appInteraction.on(appInput_1.CLIEvents.CloseHook, async (event) => {
            const statuses = [];
            const forceFlag = "-f";
            const hasForceFlag = event.originalInput.includes(forceFlag);
            for (const webhookUrl of event.args) {
                if (webhookUrl.toLowerCase() === "-f")
                    continue;
                if (!hasForceFlag && !webhookUrl.includes("discord.com") && !webhookUrl.includes("webhook")) {
                    statuses.push(`<${webhookUrl}>: Not a discord webhook! Use -f flag to forcefully delete`);
                }
                else {
                    const status = await sts.webhookHandler.deleteWebhook(webhookUrl);
                    statuses.push(`<${webhookUrl}>: ${status ? "DELETED" : "FAILED"}`);
                }
            }
            event.reply({ content: (0, utils_1.warpTripleQuote)(statuses.join("\n")) });
        });
        appInteraction.on(appInput_1.CLIEvents.CloseHook, async (event) => {
            const statuses = [];
            const forceFlag = "-f";
            let configUpdate = false;
            const hasForceFlag = event.originalInput.includes(forceFlag);
            for (const webhookUrl of event.args) {
                if (webhookUrl.toLowerCase() === "-f")
                    continue;
                if (!hasForceFlag && !webhookUrl.includes("discord.com") && !webhookUrl.includes("webhook")) {
                    statuses.push(`<${webhookUrl}>: Not a discord webhook! Use -f flag to forcefully delete`);
                }
                else {
                    const status = await sts.webhookHandler.deleteWebhook(webhookUrl);
                    statuses.push(`<${webhookUrl}>: ${status ? "DELETED" : "FAILED"}`);
                    if (status) {
                        const hooks = config.getWebhook().scamHookUrls;
                        const found = hooks.find(h => h.replace(/canary./g, ""), webhookUrl);
                        if (found) {
                            (0, utils_1.removeItem)(hooks, found);
                            configUpdate = true;
                        }
                    }
                }
            }
            const configUpdateMsg = configUpdate ? "\nWebhook list updated" : "";
            event.reply({ content: `${(0, utils_1.warpTripleQuote)(statuses.join("\n"))}${configUpdateMsg}` });
        });
        appInteraction.on(appInput_1.CLIEvents.CloseHook, async (event) => {
            if (!event.args.length)
                return provideWebhook(config, event);
            const statuses = [];
            const forceFlag = "-f";
            let configUpdate = false;
            const hasForceFlag = event.originalInput.includes(forceFlag);
            for (const webhookUrl of event.args) {
                if (webhookUrl.toLowerCase() === "-f")
                    continue;
                if (!hasForceFlag && !webhookUrl.includes("discord.com") && !webhookUrl.includes("webhook")) {
                    statuses.push(`<${webhookUrl}>: Not a discord webhook! Use -f flag to forcefully delete`);
                }
                else {
                    const status = await sts.webhookHandler.deleteWebhook(webhookUrl);
                    statuses.push(`<${webhookUrl}>: ${status ? "DELETED" : "FAILED"}`);
                    if (status) {
                        const hooks = config.getWebhook().scamHookUrls;
                        const found = hooks.find(h => removeCanary(h), removeCanary(webhookUrl));
                        if (found) {
                            (0, utils_1.removeItem)(hooks, found);
                            configUpdate = true;
                        }
                    }
                }
            }
            const configUpdateMsg = configUpdate ? "\nWebhook list updated" : "";
            event.reply({ content: `${(0, utils_1.warpTripleQuote)(statuses.join("\n"))}${configUpdateMsg}` });
        });
        appInteraction.on(appInput_1.CLIEvents.CheckHook, async (event) => {
            if (!event.args.length)
                return provideWebhook(config, event);
            const statuses = [];
            for (const webhookUrl of event.args) {
                if (!webhookUrl.includes("discord.com") && !webhookUrl.includes("webhook")) {
                    try {
                        const result = await sts.webhookHandler.checkHook(webhookUrl);
                        if (!result || !result.status) {
                            statuses.push(`<${webhookUrl}>: Failed with unknown status`);
                        }
                        else if (result.status >= 400 && result.status <= 500) {
                            statuses.push(`<${webhookUrl}>: Failed with status: ${result.status}`);
                        }
                        else {
                            statuses.push(`<${webhookUrl}>: Status: ${result.status}`);
                        }
                    }
                    catch (error) {
                        statuses.push(`<${webhookUrl}>: Status: ${error.message}`);
                    }
                }
                else {
                    const result = await sts.webhookHandler.checkHook(webhookUrl);
                    if (result.status >= 400 && result.status <= 500) {
                        statuses.push(`<${webhookUrl}>: Failed with status: ${result.status}`);
                    }
                    else {
                        let additionalInfo = "";
                        if (typeof result.data === "object") {
                            const stringBuilder = [];
                            for (const key of Object.keys(result.data)) {
                                if (result.data[key]) {
                                    stringBuilder.push(`${key}: ${result.data[key]}`);
                                }
                            }
                            additionalInfo = stringBuilder.join(("\n"));
                        }
                        if (additionalInfo) {
                            statuses.push(`<${webhookUrl}>:\n${additionalInfo}\n`);
                        }
                        else {
                            statuses.push(`<${webhookUrl}>:\nStatus ${result.status}`);
                        }
                    }
                }
            }
            event.reply({ content: (0, utils_1.warpTripleQuote)(statuses.join("\n")) });
        });
        appInteraction.on(appInput_1.CLIEvents.ConfigHookRemove, async (event) => {
            if (!event.args.length)
                return provideWebhook(config, event);
            const hooks = config.getWebhook().scamHookUrls;
            const statuses = [];
            for (const webhookUrl of event.args) {
                const sanitized = removeCanary(webhookUrl);
                const found = hooks.find(h => removeCanary(h) === sanitized);
                if (found) {
                    (0, utils_1.removeItem)(hooks, found);
                    statuses.push(`<${sanitized}>: Removed!`);
                }
                else {
                    statuses.push(`<${sanitized}>: Not list!`);
                }
            }
            statuses.push(``);
            statuses.push(`Total active scammer webhooks ${hooks.length}`);
            event.reply({ content: (0, utils_1.warpTripleQuote)(statuses.join("\n")) });
            if (!hooks.length) {
                sts.stop();
            }
        });
        appInteraction.on(appInput_1.CLIEvents.ConfigHookAdd, async (event) => {
            if (!event.args.length)
                return provideWebhook(config, event);
            const hooks = config.getWebhook().scamHookUrls;
            const statuses = [];
            for (const webhookUrl of event.args) {
                const sanitized = removeCanary(webhookUrl);
                const found = hooks.find(h => removeCanary(h) === sanitized);
                if (found) {
                    statuses.push(`<${sanitized}>: Already on list!`);
                }
                else {
                    try {
                        const result = await sts.webhookHandler.checkHook(sanitized);
                        if (result.status >= 400 && result.status <= 500) {
                            throw new Error("Failed");
                        }
                        hooks.push(sanitized);
                        statuses.push(`<${sanitized}>: Added!`);
                        sts.start();
                    }
                    catch (error) {
                        statuses.push(`<${sanitized}>: Validation failed!`);
                    }
                }
            }
            statuses.push(``);
            statuses.push(`Total active scammer webhooks ${hooks.length}`);
            event.reply({ content: (0, utils_1.warpTripleQuote)(statuses.join("\n")) });
        });
        appInteraction.on(appInput_1.CLIEvents.HooksStatuses, event => {
            const stats = sts.webhookHandler.getAllStats();
            const statuses = [];
            for (const key of Object.keys(stats)) {
                statuses.push(`${key}:\nSuccess: ${stats[key].success} Failed: ${stats[key].failed} Total: ${stats[key].total} `);
            }
            statuses.push("");
            const totalStats = sts.webhookHandler.getTotalStats();
            statuses.push(`Total: Success: ${totalStats.success} Failed: ${totalStats.failed} Total: ${totalStats.success}`);
            event.reply({ content: (0, utils_1.warpTripleQuote)(statuses.join("\n")) });
        });
        appInteraction.on(appInput_1.CLIEvents.UpdateReportHook, async (event) => {
            const webhook = event.args[0];
            if (webhook) {
                try {
                    const result = await sts.webhookHandler.send(webhook, { content: "New report has been bound" }, false);
                    if (result.isAxiosError) {
                        throw result;
                    }
                    config.getWebhook().reportHookUrl = webhook;
                    return event.reply({ content: "Update report webhook" });
                }
                catch (error) {
                    return event.reply({ content: "Provided webhook invalid!" });
                }
            }
            else {
                config.getWebhook().reportHookUrl = "";
                return event.reply({ content: "Report webhook has been removed!. It is recommended to have report webhook setup" });
            }
        });
        appInteraction.on(appInput_1.CLIEvents.Embeds, async (event) => {
            const fakeAccount = new fakeProfile_1.FakeAccount();
            const embedsGenerators = [
                initNotify_1.getInitNotifyEmbed,
                passwordChange_1.getUserPasswordChangeEmbed,
                discordInitialized_1.getDiscordInitializedEmbedUserNotLoggedIn,
                creditCardChange_1.getCreditCardEmbed,
                login_1.getUserLogonEmbed,
                loggedOut_1.getUserLogoutEmbed,
            ];
            for (const generator of embedsGenerators) {
                const embed = await generator(config, fakeAccount);
                await event.reply(embed);
            }
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
exports.createAppInteraction = createAppInteraction;
function provideWebhook(config, event) {
    let prefix = "";
    let exampleWebhook = `https://discord.com/api/webhooks/000000000000000000/gibberish`;
    if (event.data instanceof discord_js_1.Message) {
        prefix = config.getConfig().prefix;
        exampleWebhook = `<${exampleWebhook}>`;
    }
    const example = `${prefix}${event.command} ${exampleWebhook}`;
    return event.reply({ content: `Please provide webhook. Example usage: "${example}"` });
}
function removeCanary(url) {
    return url.replace(/canary./g, "");
}
