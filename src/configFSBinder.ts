import { Config, WebhookConfig } from "./interfaces";
import { CONFIG_PATH, WEBHOOK_PATH } from "./constants";
import { writeFile } from "fs-extra";
import { writeError } from "./log";


type CorW = Config | WebhookConfig
export class ConfigFSBinder {

    constructor(private config: Config, private webhook: WebhookConfig) {}

    getConfig() {
        return this.monkeyPatch({... this.config }, this.config);
    }
    getWebhook() {
        return this.monkeyPatch({... this.webhook }, this.webhook);
    }
    _getRawConfig() {
        return this.config;
    }
    _getRawWebhook() {
        return this.webhook;
    }
    _setRawConfig(config: Config) {
        this.config = config;
        return this.saveAll();
    }
    _setRawWebhook(webhook: WebhookConfig) {
        this.webhook = webhook;
        return this.saveAll();
    }
    async saveAll() {
        try {
            await writeFile(CONFIG_PATH, this.prettify(this.config));
            await writeFile(WEBHOOK_PATH, this.prettify(this.webhook));
        } catch (error) {
            console.log(error);
            writeError(error, "Unable to write configs");
        }
    }
    private monkeyPatch<O = any>(template: O, org: O) {
        for (const key of Object.keys(template)) {
            Object.defineProperty(template, key, {
                get: () => {
                    //@ts-ignore
                    return org[key];
                },
                set: (value: any) => {
                    //@ts-ignore
                    org[key] = value;
                    this.saveAll();
                }
            });
        }
        return template;
    }
    private prettify(obj: CorW) {
        return JSON.stringify(obj, undefined, 2);
    }
}
