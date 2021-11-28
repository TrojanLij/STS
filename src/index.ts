/// <reference path="typeFix/fix.d.ts" />
import { access, constants, writeFile, readFile } from "fs-extra";
import { Config, WebhookConfig } from "./interfaces";
import { start } from "./start";
import { config as dotenvConfig } from "dotenv";
import { INIT_TOKEN, FALLBACK_PREFIX, ENV_PATH, CONFIG_PATH, WEBHOOK_PATH, SECOND, INIT_SCAMMER_WH_URL, INIT_REPORT_WH_URL  } from "./constants";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { ConfigFSBinder } from "./configFSBinder";
import { writeError, prettifyConsoleOutput  } from "./log";
import { pushUniq, removeItem } from "./utils";

// Write global vars
(global as any).U = undefined;
(global as any).T = true;
(global as any).F = false;
(global as any).DEVELOPMENT = false;

prettifyConsoleOutput();

async function init() {
    try {
        await createFileIfDoesNotExit(ENV_PATH,  "NODE_ENV=\"production\"");
        const templateConfig: Config = {
            token: INIT_TOKEN,
            prefix: FALLBACK_PREFIX,
            cli: true,
            spamRate: SECOND * 2,
            _stealerConfig: {
                stealerName: "PirateStealer",
                logout: "%LOGOUT%",
                "logout-notify": true,
                "init-notify": true,
                "embed-color": 3447704,
                "disable-qr-code": false,
            }
        };
        await createFileIfDoesNotExit(CONFIG_PATH,  JSON.stringify(templateConfig, undefined, 2));
        const webhookJsonTemplate: WebhookConfig = {
            scamHookUrls: [INIT_SCAMMER_WH_URL],
            reportHookUrl: INIT_REPORT_WH_URL,
        };
        await createFileIfDoesNotExit(WEBHOOK_PATH,  JSON.stringify(webhookJsonTemplate, undefined, 2));

        const config = JSON.parse(await readFile(CONFIG_PATH, "utf-8")) as Config;
        const webhooks = JSON.parse(await readFile(WEBHOOK_PATH, "utf-8")) as WebhookConfig;

        dotenvConfig();
        (global as any).DEVELOPMENT = process.env.NODE_ENV !== "production";

        const configBinder = new ConfigFSBinder(config, webhooks);

        if (process.argv.length > 2) {
            initYargs(configBinder);
        } else {
            if (configBinder.getWebhook().scamHookUrls.includes(INIT_SCAMMER_WH_URL)) {
                console.error("Please correct webhook.json. You can use \"node app.js add-hook <hook>\"");
                process.exit(1);
            }

            start(configBinder);
        }

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

async function createFileIfDoesNotExit(path: string, fallbackContent: string) {
    try {
        await (access(path, constants.F_OK));
    } catch (error) {
        if (error.code === "ENOENT") {
            await writeFile(path, fallbackContent);
        } else {
            throw error;
        }
    }
}

function initYargs(configFsBinder: ConfigFSBinder) {
    yargs(hideBin(process.argv))
        .command("token <token>", "Add or update Discord token", (yargs) => {
            yargs.positional("token", {
                description: "Discord token",
                default: "YOUR TOKEN HERE",
            });
        },
        async (argv) => {
            const cfg = configFsBinder._getRawConfig();
            cfg.token = argv.token as string;
            try {
                configFsBinder._setRawConfig(cfg);
                await configFsBinder.saveAll();
                console.log("Updated discord token");
                process.exit(0);
            } catch (error) {
                console.error(error);
                writeError(error, "Updating token");
                process.exit(1);
            }})
        .command("add-hook <webhook>", "Add webhook of discord scammer", (yargs) =>{
            yargs.positional("webhook",{
                description: "Discord scammer webhook"
            });
        }, async (argv) => {
            const hook = configFsBinder._getRawWebhook();
            const len = hook.scamHookUrls.length;
            if (!argv.webhook) {
                console.log("webhook not provided");
                process.exit(1);
            }
            const lenNew = pushUniq(hook.scamHookUrls, argv.webhook);
            removeItem(hook.scamHookUrls, INIT_SCAMMER_WH_URL);
            if (len === lenNew) {
                console.log("Tried to add already existing hook");
                process.exit(1);
            }
            try {
                configFsBinder._setRawWebhook(hook);
                await configFsBinder.saveAll();
                console.log("Updated webhook");
                process.exit(0);
            } catch (error) {
                console.error(error);
                writeError(error, "Updating webhook");
                process.exit(1);
            }
        })
        .command("remove-hook <webhook>", "Remove webhook", (yargs) =>{
            yargs.positional("webhook",{
                description: "Discord scammer webhook"
            });
        }, async (argv) => {
            const hook = configFsBinder._getRawWebhook();
            if(removeItem(hook.scamHookUrls, argv.webhook)) {
                configFsBinder._setRawWebhook(hook);
                await configFsBinder.saveAll();
                console.log("Updated webhooks");
                process.exit(0);
            } else {
                console.log("Not on list");
                process.exit(1);
            }
        }).parse();
}

init();
