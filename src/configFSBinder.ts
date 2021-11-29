import { Config, WebhookConfig } from "./interfaces";
import { CONFIG_PATH, WEBHOOK_PATH } from "./constants";
import { writeFile } from "fs-extra";
import { writeError } from "./log";


type CorW = Config | WebhookConfig
export class ConfigFSBinder {
    constructor(private config: Config, private webhookConfig: WebhookConfig) { }

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
            apply: (target, key, values)  => {
                //@ts-ignore
                target[key](...values);
                this.saveAll();
                return true;
            }
        });

        return new Proxy({...this.webhookConfig, scamHookUrls } as WebhookConfig, {
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
    _setRawConfig(config: Config) {
        this.config = config;
        return this.saveAll();
    }
    _setRawWebhook(webhook: WebhookConfig) {
        this.webhookConfig = webhook;
        return this.saveAll();
    }
    async saveAll() {
        try {
            await writeFile(CONFIG_PATH, this.prettify(this.config));
            await writeFile(WEBHOOK_PATH, this.prettify(this.webhookConfig));
        } catch (error) {
            console.log(error);
            writeError(error, "Unable to write configs");
        }
    }
    private prettify(obj: CorW) {
        return JSON.stringify(obj, undefined, 2);
    }
}
