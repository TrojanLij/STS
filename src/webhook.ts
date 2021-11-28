import { WebhookMessageOptions } from "discord.js";
import axios, { AxiosError } from "axios";
interface WebhookStats {
    success: number,
    failed: {[key: number | string]: number};
}

interface WebhookQueryStats {
    [key: string]: WebhookStat
}
interface WebhookStat {
    success: number,
    failed: number;
    total: number;
}


export class WebhookHandler {
    private stats = new Map<string, WebhookStats>();
    async send(url: string, data: WebhookMessageOptions, stats = true) {
        try {
            const result = await axios.post(url, data);
            if (stats) this.writeSuccessStat(url);
            return result;
        } catch (error) {
            if (stats) this.writeFailedStat(url, (error as AxiosError).response?.status);
            return (error as AxiosError);
        }
    }
    getWebhookStats(url: string, detailed = false ) {
        const stats = this.stats.get(url);
        if (!stats) {
            return "No stats";
        }
        const stringBuilder: string[] = [];
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
    clearWebhookStats(url: string) {
        this.stats.delete(url);
    }

    async checkHook(url: string) {
        try {
            const result = await axios.get(url);
            return result;
        } catch (error) {
            return (error as AxiosError).response;
        }
    }
    async deleteWebhook(url: string) {
        try {
            await axios.delete(url);
            return true;
        } catch (error) {
            return false;
        }
    }
    private writeSuccessStat(url: string) {
        const stat = this.stats.get(url) || this.createEmptyStat();
        stat.success++;
        this.stats.set(url, stat);
    }
    private writeFailedStat(url: string, error?: number) {
        const stat = this.stats.get(url) || this.createEmptyStat();
        if (stat.failed[error]) {
            stat.failed[error]++;
        } else {
            stat.failed[error] = 0;
        }
        this.stats.set(url, stat);
    }
    private createEmptyStat(): WebhookStats {
        return {
            success: 0,
            failed: {},
        };
    }

    getAllStats() {
        const webHooksStats: WebhookQueryStats = {};
        this.stats.forEach((stats,  key) => {
            let failed = 0;
            const success = stats.success;
            for (const key of Object.keys(stats.failed)) {
                failed += stats.failed[key];
            }
            webHooksStats[key] = {
                failed,success, total: success + failed,
            };
        });
        return webHooksStats;
    }

    getTotalStats(): WebhookStat {
        let success = 0;
        let failed = 0;
        this.stats.forEach(stats => {
            for (const key of Object.keys(stats.failed)) {
                failed += stats.failed[key];
            }
            success += stats.success;
        });

        return { failed, success, total: failed + success };
    }
}
