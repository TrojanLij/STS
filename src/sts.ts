import { ConfigFSBinder } from "./configFSBinder";
import { WebhookHandler } from "./webhook";
import { FakeAccount } from "./fakeProfile";
import { WebhookMessageOptions } from "discord.js";
import { sample } from "lodash";
import { removeItem } from "./utils";
import { MINUTE, SECOND } from "./constants";
import { HTTPCode } from "./interfaces";
import { EventEmitter } from "events";
import { AxiosError, AxiosResponse } from "axios";

type EmbedCreatorFn = (config: ConfigFSBinder, account: FakeAccount) => Promise<WebhookMessageOptions> | WebhookMessageOptions;
type ShouldExecuteFn = () => boolean;

export interface EmbedCreator {
    fn: EmbedCreatorFn;
    execute: ShouldExecuteFn;
}

interface AccountState {
    index: number;
    webhook: string;
    account: FakeAccount;
}

enum RateLimitHeaders {

    // A unique string denoting the rate limit being encountered (non-inclusive of major parameters in the route path
    Bucket = "x-ratelimit-bucket",

    // The number of requests that can be made
    Limit = "x-ratelimit-limit",

    // The number of remaining requests that can be made
    Remaining = "x-ratelimit-remaining",

    // Epoch time (seconds since 00:00:00 UTC on January 1, 1970) at which the rate limit resets
    Reset = "x-ratelimit-reset",

    // Total time (in seconds) of when the current rate limit bucket will reset. Can have decimals to match previous millisecond ratelimit precision
    ResetAfter = "x-ratelimit-reset-after",
}
interface RateLimits {
    bucket?: string;
    limit?: number;
    remaining?: number;
    reset?: number;
    resetAfter?: number;
    rateLimitRetryAfter?: number;
}

export enum STSEvents {
    EmergencyAutShutdown = "fatal-error-emergency-auto-shutdown",
    WebhookRemoved = "webhook-removed",
    onSuccess = "webhook-sent",
    onStart = "stop",
    onStop = "start",
    onFailure = "webhook-failure",
}
interface STSEventsDeclaration {
    [STSEvents.onStart]: undefined;
    [STSEvents.onStop]: undefined;
    [STSEvents.EmergencyAutShutdown]: { fatalError: Error };
    [STSEvents.WebhookRemoved]: { webhook: string, status: string };
    [STSEvents.onFailure]: { webhook: string, axiosError: AxiosError};
    [STSEvents.onSuccess]: { webhook: string, axiosResponse: AxiosResponse };
}

export class STS {
    private readonly maxNotFoundRequest = 5;
    // https://discord.com/developers/docs/topics/rate-limits#invalid-request-limit-aka-cloudflare-bans
    private readonly RATE_LIMIT_PER_10_MIN = 9900; // exceeding 10,000 request this will get your bot ip banned!
    private eventListener = new EventEmitter();
    private maxAccounts = 5;
    private _webhookHandler= new WebhookHandler();
    private accounts: AccountState[] = [];
    private notFound = new Map<string, number>();
    private active = false;
    private frame: NodeJS.Timeout;
    private rateLimit = this.RATE_LIMIT_PER_10_MIN;
    private _startTime= new Date();

    constructor(private config: ConfigFSBinder, private embedSchemas: EmbedCreator[]) {
        setTimeout(() => {
            this.rateLimit = this.RATE_LIMIT_PER_10_MIN;
        }, MINUTE * 10);
    }
    start() {
        if (!this.active) {
            this.active = true;
            this.tickOn(0);
        }
    }
    stop() {
        this.clearFrame();
        this.active = false;
    }
    private clearFrame() {
        if (this.frame) {
            clearTimeout(this.frame);
        }
    }
    private async tick() {
        if (!this.active) {
            return;
        }
        while (this.accounts.length < this.maxAccounts) {
            this.accounts.push({
                account: new FakeAccount(),
                webhook: sample(this.config.getWebhook().scamHookUrls),
                index: 0,
            });
        }
        const headers: RateLimits = {};

        const randomAccount = sample(this.accounts);
        let executed = false;
        if (randomAccount) {
            const schema = this.embedSchemas[randomAccount.index];
            if (schema.execute()) {
                executed = true;
                const embed = await schema.fn(this.config, randomAccount.account);
                if (this.rateLimit <= 0) {
                    this.emit(STSEvents.EmergencyAutShutdown, { fatalError: new Error(`Emergency shut down. Exceeding the limit`) });
                    this.stop();
                    return;
                }

                const result = await this._webhookHandler.send(randomAccount.webhook, embed);
                let response: AxiosResponse;
                let error: AxiosError;
                if (this.isAxiosError(result)) {
                    response = result.response;
                    error = result;
                } else {
                    response = result;
                }
                if (response) {
                    headers.bucket =     response.headers[RateLimitHeaders.Bucket];
                    headers.limit =      parseFloat(response.headers[RateLimitHeaders.Limit]);
                    headers.remaining =  parseFloat(response.headers[RateLimitHeaders.Remaining]);
                    headers.reset =      parseFloat(response.headers[RateLimitHeaders.Reset]);
                    headers.resetAfter = parseFloat(response.headers[RateLimitHeaders.ResetAfter]);
                    if (response.status === HTTPCode.TooManyRequests) { // To many requests;
                        headers.rateLimitRetryAfter = parseFloat(response.data.retry_after);
                    } else if (response.status === HTTPCode.NotFound) {
                        let counter = this.notFound.get(randomAccount.webhook) || 0;
                        counter++;
                        if (counter >= this.maxNotFoundRequest) {
                            const webHooks = this.config.getWebhook();
                            removeItem(webHooks.scamHookUrls, randomAccount.webhook);
                            removeItem(this.accounts, randomAccount);
                            this.eventListener.emit(STSEvents.WebhookRemoved, this._webhookHandler.getWebhookStats(randomAccount.webhook));
                            this._webhookHandler.clearWebhookStats(randomAccount.webhook);
                            this.notFound.delete(randomAccount.webhook);
                        }
                        this.notFound.set(randomAccount.webhook, counter);
                    }
                    if (response.status !== HTTPCode.NotFound) {
                        this.notFound.delete(randomAccount.webhook);
                    }
                    if (error) {
                        this.emit(STSEvents.onFailure, {webhook: randomAccount.webhook, axiosError: error});
                    } else {
                        this.emit(STSEvents.onSuccess, {webhook: randomAccount.webhook, axiosResponse: response});
                    }
                }
            }
            randomAccount.index++;
            if (!this.embedSchemas[randomAccount.index]) {
                removeItem(this.accounts, randomAccount);
            }
        }
        if (executed) {
            // Spam as long as we don't get rate limited ;)
            if (headers) {
                if (headers.remaining > 1 && !headers.rateLimitRetryAfter) {
                    const ms = headers.resetAfter * SECOND;
                    const sendIn = ms / (headers.remaining );
                    this.tickOn(sendIn);
                    return;
                } else {
                    const wait = headers.rateLimitRetryAfter ? headers.rateLimitRetryAfter : headers.resetAfter;
                    this.tickOn((wait + 1) * SECOND);
                    return;
                }
            } else {
                this.tickOn(SECOND * 16);
                return;
            }
        } else {
            this.frame = setTimeout(() => {
                this.tick();
                this.frame = undefined;
            });
            return;
        }
    }

    private tickOn(ms: number) {
        this.clearFrame();
        if (this.active) {
            this.frame = setTimeout(() => {
                this.tick();
                this.frame = undefined;
            }, ms + (this.config.getConfig().spamRate ?? SECOND) );
        }
    }

    get webhookHandler() {
        return this._webhookHandler;
    }
    get startTime() {
        return this._startTime;
    }
    private isAxiosError(obj: any): obj is AxiosError {
        return obj.isAxiosError;
    }

    private emit(value: STSEvents.onStop, event: STSEventsDeclaration[STSEvents.onStop]): this;
    private emit(value: STSEvents.onStart, event: STSEventsDeclaration[STSEvents.onStart]): this;
    private emit(value: STSEvents.EmergencyAutShutdown, event: STSEventsDeclaration[STSEvents.EmergencyAutShutdown]): this;
    private emit(value: STSEvents.onSuccess, event: STSEventsDeclaration[STSEvents.onSuccess]): this;
    private emit(value: STSEvents.onFailure, event: STSEventsDeclaration[STSEvents.onFailure]): this;
    private emit(value: STSEvents.WebhookRemoved, event: STSEventsDeclaration[STSEvents.WebhookRemoved]): this;
    private emit(value: string, event: any) {
        this.eventListener.emit(value, event);
        return this;
    }

    on(value: STSEvents.onStop, listener: (event: STSEventsDeclaration[STSEvents.onStop]) => void): this;
    on(value: STSEvents.onStart, listener: (event: STSEventsDeclaration[STSEvents.onStart]) => void): this;
    on(value: STSEvents.EmergencyAutShutdown, listener: (event: STSEventsDeclaration[STSEvents.EmergencyAutShutdown]) => void): this;
    on(value: STSEvents.onSuccess, listener: (event: STSEventsDeclaration[STSEvents.onSuccess]) => void): this;
    on(value: STSEvents.onFailure, listener: (event: STSEventsDeclaration[STSEvents.onFailure]) => void): this;
    on(value: STSEvents.WebhookRemoved, listener: (event: STSEventsDeclaration[STSEvents.WebhookRemoved]) => void): this;
    on(value: string, listener: (...args: any[]) => void) {
        this.eventListener.on(value, listener);
        return this;
    }

    off(value: STSEvents.onStop, listener: (event: STSEventsDeclaration[STSEvents.onStop]) => void): this;
    off(value: STSEvents.onStart, listener: (event: STSEventsDeclaration[STSEvents.onStart]) => void): this;
    off(value: STSEvents.EmergencyAutShutdown, listener: (event: STSEventsDeclaration[STSEvents.EmergencyAutShutdown]) => void): this;
    off(value: STSEvents.onSuccess, listener: (event: STSEventsDeclaration[STSEvents.onSuccess]) => void): this;
    off(value: STSEvents.onFailure, listener: (event: STSEventsDeclaration[STSEvents.onFailure]) => void): this;
    off(value: STSEvents.WebhookRemoved, listener: (event: STSEventsDeclaration[STSEvents.WebhookRemoved]) => void): this;
    off(value: string, listener: (...args: any[]) => void) {
        this.eventListener.off(value, listener);
        return this;
    }
}
