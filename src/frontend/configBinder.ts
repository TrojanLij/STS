import { getTemplateConfig, getWebhookConfig } from "../sts/config";
import { Config, WebhookConfig, ConfigBinder} from "../sts/interfaces";

type CorW = Config | WebhookConfig
export class ConfigBrowserBinder implements ConfigBinder {
    private readonly configKey = "config";
    private readonly webhookKey = "webhook";

    private config: Config;
    private webhookConfig: WebhookConfig;
    constructor() {
        const configRaw =   localStorage.getItem(this.configKey);
        const webhooksRaw = localStorage.getItem(this.webhookKey);
        this.config = configRaw ? JSON.parse(configRaw) : getTemplateConfig();
        this.webhookConfig = webhooksRaw ? JSON.parse(webhooksRaw) : getWebhookConfig();
    }

    getConfig() {
        return new Proxy(this.config, {
            set: (target, key, value) => {
                //@ts-ignore
                target[key] = value;
                this.saveAll();
                return true;
            }
        }) as unknown as Config;
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
        }) as unknown as WebhookConfig;
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
        localStorage.setItem(this.configKey, JSON.stringify(this.config));
        localStorage.setItem(this.webhookKey, JSON.stringify(this.webhookConfig));
    }
    private prettify(obj: CorW) {
        return JSON.stringify(obj, undefined, 2);
    }
}
