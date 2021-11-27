"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigFSBinder = void 0;
const constants_1 = require("./constants");
const fs_extra_1 = require("fs-extra");
const log_1 = require("./log");
class ConfigFSBinder {
    constructor(config, webhookConfig) {
        this.config = config;
        this.webhookConfig = webhookConfig;
    }
    getConfig() {
        return new Proxy(this.config, {
            set: (target, key, value) => {
                //@ts-ignore
                target[key] = value;
                this.saveAll();
                return true;
            }
        });
    }
    getWebhook() {
        const scamHookUrls = new Proxy(this.webhookConfig.scamHookUrls, {
            set: (target, key, value) => {
                //@ts-ignore
                target[key] = value;
                this.saveAll();
                return true;
            },
            apply: (target, key, values) => {
                //@ts-ignore
                target[key](...values);
                this.saveAll();
                return true;
            }
        });
        return new Proxy({ ...this.webhookConfig, scamHookUrls }, {
            set: (target, key, value) => {
                //@ts-ignore
                target[key] = value;
                this.saveAll();
                return true;
            }
        });
    }
    _getRawConfig() {
        return this.config;
    }
    _getRawWebhook() {
        return this.webhookConfig;
    }
    _setRawConfig(config) {
        this.config = config;
        return this.saveAll();
    }
    _setRawWebhook(webhook) {
        this.webhookConfig = webhook;
        return this.saveAll();
    }
    async saveAll() {
        try {
            await (0, fs_extra_1.writeFile)(constants_1.CONFIG_PATH, this.prettify(this.config));
            await (0, fs_extra_1.writeFile)(constants_1.WEBHOOK_PATH, this.prettify(this.webhookConfig));
        }
        catch (error) {
            console.log(error);
            (0, log_1.writeError)(error, "Unable to write configs");
        }
    }
    prettify(obj) {
        return JSON.stringify(obj, undefined, 2);
    }
}
exports.ConfigFSBinder = ConfigFSBinder;
