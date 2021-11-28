import { WebhookMessageOptions } from "discord.js";
import axios, { AxiosError } from "axios";
interface WebhookStats {
    success: number,
    failed: {[key: number | string]: number};
}

export class WebhookHandler {
    private stats = new Map<string, WebhookStats>();
    async send(url: string, data: WebhookMessageOptions) {
        try {
            const result = await axios.post(url, data);
            this.writeSuccessStat(url);
            return result;
        } catch (error) {
            this.writeFailedStat(url, (error as AxiosError).response?.status);
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
            return result.status;
        } catch (error) {
            return (error as AxiosError).response.status;
        }
    }
    async shutHook(url: string) {
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

    getTotalStatus() {
        let success = 0;
        let failed = 0;
        this.stats.forEach(stats => {
            for (const key of Object.keys(stats.failed)) {
                failed += stats.failed[key];
            }
            success += stats.success;
        });

        return { failed, success };
    }
}
