import { Interaction, Message, MessageEmbed } from "discord.js";
import moment from "moment";
import { STS } from "./sts";
import { ConfigFSBinder } from "./configFSBinder";
import { AppInput, CLIEvent, cliEvents, CLIEvents } from "./appInput";
import { removeItem, warpInQuote, warpTripleQuote } from "./utils";
import { AxiosError } from "axios";
import { FakeAccount } from "./fakeProfile";
import { getUserLogonEmbed } from "./embeds/login";
import { getUserLogoutEmbed } from "./embeds/loggedOut";
import { getInitNotifyEmbed } from "./embeds/initNotify";
import { getUserPasswordChangeEmbed } from "./embeds/passwordChange";
import { getCreditCardEmbed } from "./embeds/creditCardChange";
import { getDiscordInitializedEmbedUserNotLoggedIn } from "./embeds/discordInitialized";

export function createAppInteraction(config: ConfigFSBinder, sts:STS, appInteractions: AppInput[]) {
    for (const appInteraction of appInteractions) {
        appInteraction.on(CLIEvents.Help, event => {
            let prefix = "";
            if(event.data) {
                if (event.data instanceof Message) {
                    prefix = config.getConfig().prefix;
                } else if (event.data instanceof Interaction) {
                    prefix = "/";
                }
            }

            event.reply({ content: warpTripleQuote(cliEvents.map(c => `${prefix}${c.alias[0]} = ${c.info}`).join("\n"))});
        });
        appInteraction.on(CLIEvents.Status, event => {
            const embed = new MessageEmbed();
            embed.setTitle("HOMO REQUESTED");
            embed.setColor(0xff00ff);

            embed.setImage("https://c.tenor.com/TJiQDMvpWuoAAAAC/itsascam-scam.gif");
            embed.setAuthor("Bill Clinton");
            embed.setFooter("Fucking with scammers since 99");
            embed.addField("StartTime", warpInQuote(sts.startTime.toLocaleString()), true);
            embed.addField("Started", warpInQuote(moment(sts.startTime).fromNow()), true);
            const totalStatus = sts.webhookHandler.getTotalStats();

            embed.addField("How many messages? *(to little)*", warpInQuote(totalStatus.success.toString()), true);
            embed.addField("Failed request? *(oh no)*", warpInQuote(totalStatus.failed.toString()), true);
            embed.addField("Count hooks", warpInQuote(config.getWebhook().scamHookUrls.length.toString()), true);

            event.reply({ embeds: [embed.toJSON()]});
        });

        appInteraction.on(CLIEvents.CloseHook, async event => {
            const statuses: string[] = [];
            const forceFlag = "-f";
            const hasForceFlag = event.originalInput.includes(forceFlag);
            for (const webhookUrl of event.args) {
                if (webhookUrl.toLowerCase() === "-f") continue;
                if (!hasForceFlag && !webhookUrl.includes("discord.com") && !webhookUrl.includes("webhook")) {
                    statuses.push(`<${webhookUrl}>: Not a discord webhook! Use -f flag to forcefully delete`);
                } else {
                    const status = await sts.webhookHandler.deleteWebhook(webhookUrl);
                    statuses.push(`<${webhookUrl}>: ${status ? "DELETED" : "FAILED"}`);
                }
            }
            event.reply({ content: warpTripleQuote(statuses.join("\n"))});
        });

        appInteraction.on(CLIEvents.CloseHook, async event => {
            const statuses: string[] = [];
            const forceFlag = "-f";
            let configUpdate = false;
            const hasForceFlag = event.originalInput.includes(forceFlag);
            for (const webhookUrl of event.args) {
                if (webhookUrl.toLowerCase() === "-f") continue;
                if (!hasForceFlag && !webhookUrl.includes("discord.com") && !webhookUrl.includes("webhook")) {
                    statuses.push(`<${webhookUrl}>: Not a discord webhook! Use -f flag to forcefully delete`);
                } else {
                    const status = await sts.webhookHandler.deleteWebhook(webhookUrl);
                    statuses.push(`<${webhookUrl}>: ${status ? "DELETED" : "FAILED"}`);
                    if (status) {
                        const hooks = config.getWebhook().scamHookUrls;
                        const found = hooks.find(h => h.replace(/canary./g, ""), webhookUrl);
                        if (found) {
                            removeItem(hooks, found);
                            configUpdate = true;
                        }
                    }
                }
            }
            const configUpdateMsg = configUpdate ? "\nWebhook list updated" : "";
            event.reply({ content: `${warpTripleQuote(statuses.join("\n"))}${configUpdateMsg}`});
        });

        appInteraction.on(CLIEvents.CloseHook, async event => {
            if (!event.args.length) return provideWebhook(config, event);
            const statuses: string[] = [];

            const forceFlag = "-f";
            let configUpdate = false;
            const hasForceFlag = event.originalInput.includes(forceFlag);
            for (const webhookUrl of event.args) {
                if (webhookUrl.toLowerCase() === "-f") continue;
                if (!hasForceFlag && !webhookUrl.includes("discord.com") && !webhookUrl.includes("webhook")) {
                    statuses.push(`<${webhookUrl}>: Not a discord webhook! Use -f flag to forcefully delete`);
                } else {
                    const status = await sts.webhookHandler.deleteWebhook(webhookUrl);
                    statuses.push(`<${webhookUrl}>: ${status ? "DELETED" : "FAILED"}`);
                    if (status) {
                        const hooks = config.getWebhook().scamHookUrls;
                        const found = hooks.find(h => removeCanary(h), removeCanary(webhookUrl));
                        if (found) {
                            removeItem(hooks, found);
                            configUpdate = true;
                        }
                    }
                }
            }
            const configUpdateMsg = configUpdate ? "\nWebhook list updated" : "";
            event.reply({ content: `${warpTripleQuote(statuses.join("\n"))}${configUpdateMsg}`});
        });

        appInteraction.on(CLIEvents.CheckHook, async event => {
            if (!event.args.length) return provideWebhook(config, event);
            const statuses: string[] = [];

            for (const webhookUrl of event.args) {
                if (!webhookUrl.includes("discord.com") && !webhookUrl.includes("webhook")) {
                    try {
                        const result = await sts.webhookHandler.checkHook(webhookUrl);
                        if(!result || !result.status) {
                            statuses.push(`<${webhookUrl}>: Failed with unknown status`);
                        } else if (result.status >= 400 && result.status <= 500) {
                            statuses.push(`<${webhookUrl}>: Failed with status: ${result.status}`);
                        } else {
                            statuses.push(`<${webhookUrl}>: Status: ${result.status}`);
                        }
                    } catch (error) {
                        statuses.push(`<${webhookUrl}>: Status: ${error.message}`);
                    }
                } else {
                    const result = await sts.webhookHandler.checkHook(webhookUrl);
                    if (result.status >= 400 && result.status <= 500) {
                        statuses.push(`<${webhookUrl}>: Failed with status: ${result.status}`);
                    } else {
                        let additionalInfo = "";
                        if (typeof result.data === "object") {
                            const stringBuilder: string[] = [];
                            for (const key of Object.keys(result.data)) {
                                if (result.data[key]) {
                                    stringBuilder.push(`${key}: ${result.data[key]}`);
                                }
                            }
                            additionalInfo = stringBuilder.join(("\n"));
                        }
                        if (additionalInfo) {
                            statuses.push(`<${webhookUrl}>:\n${additionalInfo}\n`);
                        } else {
                            statuses.push(`<${webhookUrl}>:\nStatus ${result.status}`);
                        }
                    }
                }
            }

            event.reply({content: warpTripleQuote(statuses.join("\n")) });
        });

        appInteraction.on(CLIEvents.ConfigHookRemove, async event => {
            if (!event.args.length) return provideWebhook(config, event);
            const hooks = config.getWebhook().scamHookUrls;

            const statuses: string[] = [];
            for (const webhookUrl of event.args) {
                const sanitized = removeCanary(webhookUrl);
                const found = hooks.find(h => removeCanary(h) === sanitized);
                if (found) {
                    removeItem(hooks, found);
                    statuses.push(`<${sanitized}>: Removed!`);
                } else {
                    statuses.push(`<${sanitized}>: Not list!`);
                }
            }

            statuses.push(``);
            statuses.push(`Total active scammer webhooks ${hooks.length}`);
            event.reply({ content: warpTripleQuote(statuses.join("\n"))});
            if (!hooks.length) {
                sts.stop();
            }
        });

        appInteraction.on(CLIEvents.ConfigHookAdd, async event => {
            if (!event.args.length) return provideWebhook(config, event);
            const hooks = config.getWebhook().scamHookUrls;

            const statuses: string[] = [];
            for (const webhookUrl of event.args) {
                const sanitized = removeCanary(webhookUrl);
                const found = hooks.find(h => removeCanary(h) === sanitized);
                if (found) {
                    statuses.push(`<${sanitized}>: Already on list!`);
                } else {
                    try {
                        const result = await  sts.webhookHandler.checkHook(sanitized);
                        if (result.status >= 400 && result.status <= 500) {
                            throw new Error("Failed");
                        }
                        hooks.push(sanitized);
                        statuses.push(`<${sanitized}>: Added!`);
                        sts.start();
                    } catch (error) {
                        statuses.push(`<${sanitized}>: Validation failed!`);
                    }
                }
            }

            statuses.push(``);
            statuses.push(`Total active scammer webhooks ${hooks.length}`);
            event.reply({ content: warpTripleQuote(statuses.join("\n"))});
        });

        appInteraction.on(CLIEvents.HooksStatuses, event => {
            const stats = sts.webhookHandler.getAllStats();
            const statuses: string[] = [];
            for (const key of Object.keys(stats)) {
                statuses.push(`${key}:\nSuccess: ${stats[key].success} Failed: ${stats[key].failed} Total: ${stats[key].total} `);
            }
            statuses.push("");
            const totalStats = sts.webhookHandler.getTotalStats();
            statuses.push(`Total: Success: ${totalStats.success} Failed: ${totalStats.failed} Total: ${totalStats.success}`);
            event.reply({ content: warpTripleQuote(statuses.join("\n"))});
        });

        appInteraction.on(CLIEvents.UpdateReportHook, async event => {
            const webhook = event.args[0];
            if (webhook) {
                try {
                    const result = await sts.webhookHandler.send(webhook, {content: "New report has been bound"}, false);
                    if ((result as AxiosError).isAxiosError) {
                        throw (result as AxiosError);
                    }
                    config.getWebhook().reportHookUrl = webhook;
                    return event.reply({content: "Update report webhook"});
                } catch (error) {
                    return event.reply({content: "Provided webhook invalid!"});
                }
            } else {
                config.getWebhook().reportHookUrl = "";
                return event.reply({content: "Report webhook has been removed!. It is recommended to have report webhook setup"});
            }
        });


        appInteraction.on(CLIEvents.Embeds, async event => {
            const fakeAccount = new FakeAccount();
            const embedsGenerators = [
                getInitNotifyEmbed,
                getUserPasswordChangeEmbed,
                getDiscordInitializedEmbedUserNotLoggedIn,
                getCreditCardEmbed,
                getUserLogonEmbed,
                getUserLogoutEmbed,
            ];

            for (const generator of embedsGenerators) {
                const embed = await generator(config, fakeAccount);
                await event.reply(embed);
            }
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


function provideWebhook(config: ConfigFSBinder, event: CLIEvent<any>) {
    let prefix = "";
    let exampleWebhook = `https://discord.com/api/webhooks/000000000000000000/gibberish`;
    if (event.data instanceof Message) {
        prefix = config.getConfig().prefix;
        exampleWebhook = `<${exampleWebhook}>`;
    }

    const example = `${prefix}${event.command} ${exampleWebhook}`;

    return event.reply({content: `Please provide webhook. Example usage: "${example}"`});
}

function removeCanary(url:string) {
    return url.replace(/canary./g, "");
}
