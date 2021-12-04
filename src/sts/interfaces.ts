export interface Config {
    token: string,
    prefix: string,
    spamRate: number
    cli: boolean;
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

export interface CreditCard {
    id: string;
    expiration: string;
    cvc: string;
}


//https://www.restapitutorial.com/httpstatuscodes.html
export enum HTTPCode {

    //1xx Informational
    Continue = 100,
    SwitchingProtocols = 101,
    ProcessingWebDAV = 102,

    //2xx Success
    OK = 200,
    Created = 201,
    Accepted = 202,
    NonAuthoritativeInformation = 203,
    NoContent = 204,
    ResetContent = 205,
    PartialContent = 206,
    MultiStatusWebDAV = 207,
    AlreadyReportedWebDAV = 208,
    IMUsed = 226,

    //3xx Redirection
    MultipleChoices = 300,
    MovedPermanently = 301,
    Found = 302,
    SeeOther = 303,
    NotModified = 304,
    UseProxy = 305,
    Unused = 306,
    TemporaryRedirect = 307,
    PermanentRedirectExperimental = 308,

    //4xx Client Error
    BadRequest = 400,
    Unauthorized = 401,
    PaymentRequired = 402,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    NotAcceptable = 406,
    ProxyAuthenticationRequired = 407,
    RequestTimeout = 408,
    Conflict = 409,
    Gone = 410,
    LengthRequired = 411,
    PreconditionFailed = 412,
    RequestEntityTooLarge = 413,
    RequestURITooLong = 414,
    UnsupportedMediaType = 415,
    RequestedRangeNotSatisfiable = 416,
    ExpectationFailed = 417,
    IAmaTeapotRFC2324 = 418,
    EnhanceYourCalmTwitter = 420,
    UnprocessableEntityWebDAV = 422,
    LockedWebDAV = 423,
    FailedDependencyWebDAV = 424,
    ReservedforWebDAV = 425,
    UpgradeRequired = 426,
    PreconditionRequired = 428,
    TooManyRequests = 429,
    RequestHeaderFieldsTooLarge = 431,
    NoResponseNginx = 444,
    RetryWithMicrosoft = 449,
    BlockedByWindowsParentalControlsMicrosoft = 450,
    UnavailableForLegalReasons = 451,
    ClientClosedRequestNginx = 499,

    //5xx Server Error
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
    HTTPVersionNotSupported = 505,
    VariantAlsoNegotiatesExperimental = 506,
    InsufficientStorageWebDAV = 507,
    LoopDetectedWebDAV = 508,
    BandwidthLimitExceededApache = 509,
    NotExtended = 510,
    NetworkAuthenticationRequired = 511,
    NetworkReadTimeoutError = 598,
    NetworkConnectTimeoutError = 599,
}

export interface ConfigBinder {
    getConfig: () => Config;
    getWebhook: () => WebhookConfig;
    _getRawConfig: () => Config;
    _getRawWebhook: () => WebhookConfig;
    _setRawConfig: (config: Config) => void;
    _setRawWebhook: (webhook: WebhookConfig) => void;
    saveAll(): Promise<void>;
}
