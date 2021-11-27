"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookHandler = void 0;
const axios_1 = __importDefault(require("axios"));
class WebhookHandler {
    constructor() {
        this.stats = new Map();
    }
    async send(url, data) {
        try {
            const result = await axios_1.default.post(url, data);
            this.writeSuccessStat(url);
            return result;
        }
        catch (error) {
            this.writeFailedStat(url, error.response?.status);
            return error;
        }
    }
    getWebhookStats(url, detailed = false) {
        const stats = this.stats.get(url);
        if (!stats) {
            return "No stats";
        }
        const stringBuilder = [];
        let failedRequests = 0;
        for (const key of Object.keys(stats.failed)) {
            failedRequests += stats.failed[key];
        }
        stringBuilder.push(`Webhook stats: ${url}:`);
        stringBuilder.push(`Total: ${stats.success + failedRequests}`);
        stringBuilder.push(`Successful: ${stats.success}`);
        stringBuilder.push(`Failed: ${failedRequests}`);
        if (detailed) {
            stringBuilder.push(`Failed details:`);
            for (const key of Object.keys(stats.failed)) {
                stringBuilder.push(` Error(${key}): ${stats.failed[key]}`);
            }
        }
        return stringBuilder.join("\n");
    }
    clearWebhookStats(url) {
        this.stats.delete(url);
    }
    async checkHook(url) {
        try {
            const result = await axios_1.default.get(url);
            return result.status;
        }
        catch (error) {
            return error.response.status;
        }
    }
    async shutHook(url) {
        try {
            await axios_1.default.delete(url);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    writeSuccessStat(url) {
        const stat = this.stats.get(url) || this.createEmptyStat();
        stat.success++;
        this.stats.set(url, stat);
    }
    writeFailedStat(url, error) {
        const stat = this.stats.get(url) || this.createEmptyStat();
        if (stat.failed[error]) {
            stat.failed[error]++;
        }
        else {
            stat.failed[error] = 0;
        }
        this.stats.set(url, stat);
    }
    createEmptyStat() {
        return {
            success: 0,
            failed: {},
        };
    }
}
exports.WebhookHandler = WebhookHandler;
