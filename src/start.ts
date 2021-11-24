import { Config, WebhookConfig } from "./interfaces";
import { DEVELOPMENT } from "./utils";

export function start(config: Config, webhooks: WebhookConfig) {
    if (DEVELOPMENT) {
        console.log("ay it works");
        console.log(config, webhooks);
    }
}
