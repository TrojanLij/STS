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
    STSEvents["EmergencyAutShutdown"] = "fatal-error-emergency-auto-shutdown";
    STSEvents["WebhookRemoved"] = "webhook-removed";
    STSEvents["onSuccess"] = "webhook-sent";
    STSEvents["onStart"] = "stop";
    STSEvents["onStop"] = "start";
    STSEvents["onFailure"] = "webhook-failure";
})(STSEvents = exports.STSEvents || (exports.STSEvents = {}));
class STS {
    constructor(config, embedSchemas) {
        this.config = config;
        this.embedSchemas = embedSchemas;
        this.maxNotFoundRequest = 5;
        // https://discord.com/developers/docs/topics/rate-limits#invalid-request-limit-aka-cloudflare-bans
        this.RATE_LIMIT_PER_10_MIN = 9900; // exceeding 10,000 request this will get your bot ip banned!
        this.eventListener = new events_1.EventEmitter();
        this.maxAccounts = 5;
        this._webhookHandler = new webhook_1.WebhookHandler();
        this.accounts = [];
        this.notFound = new Map();
        this.active = false;
        this.rateLimit = this.RATE_LIMIT_PER_10_MIN;
        this._startTime = new Date();
        setTimeout(() => {
            this.rateLimit = this.RATE_LIMIT_PER_10_MIN;
        }, constants_1.MINUTE * 10);
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
    clearFrame() {
        if (this.frame) {
            clearTimeout(this.frame);
        }
    }
    async tick() {
        if (!this.active) {
            return;
        }
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
                executed = true;
                const embed = await schema.fn(this.config, randomAccount.account);
                if (this.rateLimit <= 0) {
                    this.emit(STSEvents.EmergencyAutShutdown, { fatalError: new Error(`Emergency shut down. Exceeding the limit`) });
                    this.stop();
                    return;
                }
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
                    headers.limit = parseFloat(response.headers[RateLimitHeaders.Limit]);
                    headers.remaining = parseFloat(response.headers[RateLimitHeaders.Remaining]);
                    headers.reset = parseFloat(response.headers[RateLimitHeaders.Reset]);
                    headers.resetAfter = parseFloat(response.headers[RateLimitHeaders.ResetAfter]);
                    if (response.status === interfaces_1.HTTPCode.TooManyRequests) { // To many requests;
                        headers.rateLimitRetryAfter = parseFloat(response.data.retry_after);
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
            }
            randomAccount.index++;
            if (!this.embedSchemas[randomAccount.index]) {
                (0, utils_1.removeItem)(this.accounts, randomAccount);
            }
        }
        if (executed) {
            // Spam as long as we don't get rate limited ;)
            if (headers) {
                if (headers.remaining > 1 && !headers.rateLimitRetryAfter) {
                    const ms = headers.resetAfter * constants_1.SECOND;
                    const sendIn = ms / (headers.remaining);
                    this.tickOn(sendIn);
                    return;
                }
                else {
                    const wait = headers.rateLimitRetryAfter ? headers.rateLimitRetryAfter : headers.resetAfter;
                    this.tickOn((wait + 1) * constants_1.SECOND);
                    return;
                }
            }
            else {
                this.tickOn(constants_1.SECOND * 16);
                return;
            }
        }
        else {
            this.frame = setTimeout(() => {
                this.tick();
                this.frame = undefined;
            });
            return;
        }
    }
    tickOn(ms) {
        this.clearFrame();
        if (this.active) {
            this.frame = setTimeout(() => {
                this.tick();
                this.frame = undefined;
            }, ms + (this.config.getConfig().spamRate ?? constants_1.SECOND));
        }
    }
    get webhookHandler() {
        return this._webhookHandler;
    }
    get startTime() {
        return this._startTime;
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
