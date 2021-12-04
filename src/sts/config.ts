import { FALLBACK_PREFIX, INIT_REPORT_WH_URL, INIT_SCAMMER_WH_URL, INIT_TOKEN, SECOND } from "../../dist/sts/constants";
import { Config, WebhookConfig } from "./interfaces";

export function getTemplateConfig(): Config {
    return {
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
}

export function getWebhookConfig(): WebhookConfig {
    return {
        scamHookUrls: [INIT_SCAMMER_WH_URL],
        reportHookUrl: INIT_REPORT_WH_URL,
    };
}
