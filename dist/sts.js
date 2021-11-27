"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STS = exports.STSEvents = void 0;
const webhook_1 = require("./webhook");
const fakeProfile_1 = require("./fakeProfile");
const lodash_1 = require("lodash");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const interfaces_1 = require("./interfaces");
const events_1 = require("events");
var RateLimitHeaders;
(function (RateLimitHeaders) {
    // A unique string denoting the rate limit being encountered (non-inclusive of major parameters in the route path
    RateLimitHeaders["Bucket"] = "x-ratelimit-bucket";
    // The number of requests that can be made
    RateLimitHeaders["Limit"] = "x-ratelimit-limit";
    // The number of remaining requests that can be made
    RateLimitHeaders["Remaining"] = "x-ratelimit-remaining";
    // Epoch time (seconds since 00:00:00 UTC on January 1, 1970) at which the rate limit resets
    RateLimitHeaders["Reset"] = "x-ratelimit-reset";
    // Total time (in seconds) of when the current rate limit bucket will reset. Can have decimals to match previous millisecond ratelimit precision
    RateLimitHeaders["ResetAfter"] = "x-ratelimit-reset-after";
})(RateLimitHeaders || (RateLimitHeaders = {}));
var STSEvents;
(function (STSEvents) {
    STSEvents["WebhookRemoved"] = "webhook-removed";
    STSEvents["onSuccess"] = "webhook-sent";
    STSEvents["onFailure"] = "webhook-failure";
})(STSEvents = exports.STSEvents || (exports.STSEvents = {}));
class STS {
    config;
    embedSchemas;
    maxNotFoundRequest = 5;
    eventListener = new events_1.EventEmitter();
    maxAccounts = 5;
    _webhookHandler = new webhook_1.WebhookHandler();
    accounts = [];
    i = 0;
    notFound = new Map();
    constructor(config, embedSchemas) {
        this.config = config;
        this.embedSchemas = embedSchemas;
    }
    async tick() {
        while (this.accounts.length < this.maxAccounts) {
            this.accounts.push({
                account: new fakeProfile_1.FakeAccount(),
                webhook: (0, lodash_1.sample)(this.config.getWebhook().scamHookUrls),
                index: 0,
            });
        }
        const headers = {};
        const randomAccount = (0, lodash_1.sample)(this.accounts);
        let executed = false;
        if (randomAccount) {
            const schema = this.embedSchemas[randomAccount.index];
            if (schema.execute()) {
                const embed = await schema.fn(this.config, randomAccount.account);
                const result = await this._webhookHandler.send(randomAccount.webhook, embed);
                let response;
                let error;
                if (this.isAxiosError(result)) {
                    response = result.response;
                    error = result;
                }
                else {
                    response = result;
                }
                if (response) {
                    headers.bucket = response.headers[RateLimitHeaders.Bucket];
                    headers.limit = parseInt(response.headers[RateLimitHeaders.Limit], 10);
                    headers.remaining = parseInt(response.headers[RateLimitHeaders.Remaining], 10);
                    headers.reset = parseInt(response.headers[RateLimitHeaders.Reset], 10);
                    headers.resetAfter = parseInt(response.headers[RateLimitHeaders.ResetAfter], 10);
                    if (response.status === interfaces_1.HTTPCode.TooManyRequests) { // To many requests;
                        headers.rateLimitRetryAfter = parseInt(response.data.retry_after, 10);
                    }
                    else if (response.status === interfaces_1.HTTPCode.NotFound) {
                        let counter = this.notFound.get(randomAccount.webhook) || 0;
                        counter++;
                        if (counter >= this.maxNotFoundRequest) {
                            const webHooks = this.config.getWebhook();
                            (0, utils_1.removeItem)(webHooks.scamHookUrls, randomAccount.webhook);
                            (0, utils_1.removeItem)(this.accounts, randomAccount);
                            this.eventListener.emit(STSEvents.WebhookRemoved, this._webhookHandler.getWebhookStats(randomAccount.webhook));
                            this._webhookHandler.clearWebhookStats(randomAccount.webhook);
                            this.notFound.delete(randomAccount.webhook);
                        }
                        this.notFound.set(randomAccount.webhook, counter);
                    }
                    if (response.status !== interfaces_1.HTTPCode.NotFound) {
                        this.notFound.delete(randomAccount.webhook);
                    }
                    if (error) {
                        this.emit(STSEvents.onFailure, { webhook: randomAccount.webhook, axiosError: error });
                    }
                    else {
                        this.emit(STSEvents.onSuccess, { webhook: randomAccount.webhook, axiosResponse: response });
                    }
                }
                executed = true;
            }
            randomAccount.index++;
            if (!this.embedSchemas[randomAccount.index]) {
                (0, utils_1.removeItem)(this.accounts, randomAccount);
            }
        }
        if (!executed) {
            this.tick();
        }
        else {
            // Spam as long as we don't get rate limited ;)
            if (headers) {
                if (headers.remaining > 1 && !headers.rateLimitRetryAfter) {
                    this.tick();
                    return;
                }
                else {
                    const wait = headers.rateLimitRetryAfter ? headers.rateLimitRetryAfter : headers.resetAfter;
                    setTimeout(() => {
                        this.tick();
                    }, (wait + 1) * 1000);
                    return;
                }
            }
            else {
                await (0, utils_1.delay)(constants_1.SECOND * 16);
                this.tick();
            }
        }
    }
    get webhookHandler() {
        return this._webhookHandler;
    }
    isAxiosError(obj) {
        return obj.isAxiosError;
    }
    emit(value, event) {
        this.eventListener.emit(value, event);
        return this;
    }
    on(value, listener) {
        this.eventListener.on(value, listener);
        return this;
    }
    off(value, listener) {
        this.eventListener.off(value, listener);
        return this;
    }
}
exports.STS = STS;
