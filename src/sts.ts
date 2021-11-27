import { ConfigFSBinder } from "./configFSBinder";
import { WebhookHandler } from "./webhook";
import { FakeAccount } from "./fakeProfile";
import { WebhookMessageOptions } from "discord.js";
import { result, sample } from "lodash";
import { delay, removeItem } from "./utils";
import { SECOND } from "./constants";
import { HTTPCode } from "./interfaces";
import { EventEmitter } from "events";
import { string } from "yargs";
import { Axios, AxiosError, AxiosResponse } from "axios";

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
    WebhookRemoved = "webhook-removed",
    onSuccess = "webhook-sent",
    onFailure = "webhook-failure",
}
interface STSEventsDeclaration {
    [STSEvents.WebhookRemoved]: { webhook: string, status: string };
    [STSEvents.onFailure]: { webhook: string, axiosError: AxiosError};
    [STSEvents.onSuccess]: { webhook: string, axiosResponse: AxiosResponse };
}

export class STS {
    private readonly maxNotFoundRequest = 5;
    private eventListener = new EventEmitter();
    private maxAccounts = 5;
    private _webhookHandler= new WebhookHandler();
    private accounts: AccountState[] = [];
    private i = 0;
    private notFound = new Map<string, number>()
    constructor(private config: ConfigFSBinder, private embedSchemas: EmbedCreator[]) {}

    async tick() {
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
                const embed = await schema.fn(this.config, randomAccount.account);
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
                    headers.limit =      parseInt(response.headers[RateLimitHeaders.Limit], 10);
                    headers.remaining =  parseInt(response.headers[RateLimitHeaders.Remaining], 10);
                    headers.reset =      parseInt(response.headers[RateLimitHeaders.Reset], 10);
                    headers.resetAfter = parseInt(response.headers[RateLimitHeaders.ResetAfter], 10);
                    if (response.status === HTTPCode.TooManyRequests) { // To many requests;
                        headers.rateLimitRetryAfter = parseInt(response.data.retry_after, 10);
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
                executed = true;
            }
            randomAccount.index++;
            if (!this.embedSchemas[randomAccount.index]) {
                removeItem(this.accounts, randomAccount);
            }
        }
        if (!executed) {
            this.tick()
        } else {
            // Spam as long as we don't get rate limited ;)
            if (headers) {
                if (headers.remaining > 1 && !headers.rateLimitRetryAfter) {
                    this.tick();
                    return;
                } else {
                    const wait = headers.rateLimitRetryAfter ? headers.rateLimitRetryAfter : headers.resetAfter; 
                    setTimeout(() => {
                        this.tick();
                    }, (wait + 1) * 1000)
                    return;
                }
            } else {
                await delay(SECOND * 16);
                this.tick();
            }
        }
    }

    get webhookHandler() {
        return this._webhookHandler;
    }

    private isAxiosError(obj: any): obj is AxiosError {
        return obj.isAxiosError;
    }

    private emit(value: STSEvents.onSuccess, event: STSEventsDeclaration[STSEvents.onSuccess]): this;
    private emit(value: STSEvents.onFailure, event: STSEventsDeclaration[STSEvents.onFailure]): this;
    private emit(value: STSEvents.WebhookRemoved, event: STSEventsDeclaration[STSEvents.WebhookRemoved]): this;
    private emit(value: string, event: any) {
        this.eventListener.emit(value, event);
        return this;
    }
  
    on(value: STSEvents.onSuccess, listener: (event: STSEventsDeclaration[STSEvents.onSuccess]) => void): this;
    on(value: STSEvents.onFailure, listener: (event: STSEventsDeclaration[STSEvents.onFailure]) => void): this;
    on(value: STSEvents.WebhookRemoved, listener: (event: STSEventsDeclaration[STSEvents.WebhookRemoved]) => void): this;
    on(value: string, listener: (...args: any[]) => void) {
        this.eventListener.on(value, listener);
        return this;
    }

    off(value: STSEvents.onSuccess, listener: (event: STSEventsDeclaration[STSEvents.onSuccess]) => void): this;
    off(value: STSEvents.onFailure, listener: (event: STSEventsDeclaration[STSEvents.onFailure]) => void): this;
    off(value: STSEvents.WebhookRemoved, listener: (event: STSEventsDeclaration[STSEvents.WebhookRemoved]) => void): this;
    off(value: string, listener: (...args: any[]) => void) {
        this.eventListener.off(value, listener);
        return this;
    }
}
