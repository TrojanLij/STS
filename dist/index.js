"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="typeFix/fix.d.ts" />
const fs_extra_1 = require("fs-extra");
const start_1 = require("./start");
const dotenv_1 = require("dotenv");
const constants_1 = require("./constants");
const yargs = require("yargs");
const helpers_1 = require("yargs/helpers");
const configFSBinder_1 = require("./configFSBinder");
const log_1 = require("./log");
const utils_1 = require("./utils");
// Write global vars
global.U = undefined;
global.T = true;
global.F = false;
global.DEVELOPMENT = false;
(0, log_1.prettifyConsoleOutput)();
async function init() {
    try {
        await createFileIfDoesNotExit(constants_1.ENV_PATH, "NODE_ENV=\"production\"");
        const templateConfig = {
            token: constants_1.INIT_TOKEN,
            prefix: constants_1.FALLBACK_PREFIX,
            ignoreErrors: false,
            _stealerConfig: {
                stealerName: "PirateStealer",
                logout: "%LOGOUT%",
                "logout-notify": false,
                "init-notify": false,
                "embed-color": 3447704,
                "disable-qr-code": false,
            }
        };
        await createFileIfDoesNotExit(constants_1.CONFIG_PATH, JSON.stringify(templateConfig, undefined, 2));
        const webhookJsonTemplate = {
            scamHookUrls: ["scammer_WH_URL"],
            reportHookUrl: "report_WH_URL",
        };
        await createFileIfDoesNotExit(constants_1.WEBHOOK_PATH, JSON.stringify(webhookJsonTemplate, undefined, 2));
        const config = JSON.parse(await (0, fs_extra_1.readFile)(constants_1.CONFIG_PATH, "utf-8"));
        const webhooks = JSON.parse(await (0, fs_extra_1.readFile)(constants_1.WEBHOOK_PATH, "utf-8"));
        (0, dotenv_1.config)();
        global.DEVELOPMENT = process.env.NODE_ENV !== "production";
        const configBinder = new configFSBinder_1.ConfigFSBinder(config, webhooks);
        if (process.argv.length > 2) {
            initYargs(configBinder);
        }
        else {
            (0, start_1.start)(configBinder);
        }
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
async function createFileIfDoesNotExit(path, fallbackContent) {
    try {
        await ((0, fs_extra_1.access)(path, fs_extra_1.constants.F_OK));
    }
    catch (error) {
        if (error.code === "ENOENT") {
            await (0, fs_extra_1.writeFile)(path, fallbackContent);
        }
        else {
            throw error;
        }
    }
}
function initYargs(configFsBinder) {
    yargs((0, helpers_1.hideBin)(process.argv))
        .command("token <token>", "Add or update Discord token", (yargs) => {
        yargs.positional("token", {
            description: "Discord token",
            default: "YOUR TOKEN HERE",
        });
    }, async (argv) => {
        const cfg = configFsBinder._getRawConfig();
        cfg.token = argv.token;
        try {
            configFsBinder._setRawConfig(cfg);
            await configFsBinder.saveAll();
            console.log("Updated discord token");
            process.exit(0);
        }
        catch (error) {
            console.error(error);
            (0, log_1.writeError)(error, "Updating token");
            process.exit(1);
        }
    })
        .command("add-hook <hook>", "Add webhook of discord scammer", (yargs) => {
        yargs.positional("hook", {
            description: "Discord scammer webhook"
        });
    }, async (argv) => {
        const hook = configFsBinder._getRawWebhook();
        const len = hook.scamHookUrls.length;
        const lenNew = (0, utils_1.pushUniq)(hook.scamHookUrls, argv.hook);
        if (len === lenNew) {
            console.log("Tried to add already existing hook");
            process.exit(1);
        }
        try {
            configFsBinder._setRawWebhook(hook);
            await configFsBinder.saveAll();
            console.log("Updated webhook");
            process.exit(0);
        }
        catch (error) {
            console.error(error);
            (0, log_1.writeError)(error, "Updating webhook");
            process.exit(1);
        }
    }).parse();
}
init();
