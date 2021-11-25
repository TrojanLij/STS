export interface Config {
    token: string,
    prefix: string,
    ignoreErrors: boolean,
}

export interface WebhookConfig {
    scamHookUrls: string[];
    reportHookUrl: string;
}

export interface Rare<T = any> {
    data: T;
    rare: number;
}
