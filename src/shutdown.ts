import { ConfigFSBinder } from "./configFSBinder";
import { STS } from "./sts";
import { DiscordBotInterface } from "./discordBotInterface/botInterface";
import { INIT_SCAMMER_WH_URL } from "./constants";
import { warpTripleQuote, sanitizeString } from "./utils";

let shuttingDown = false;
export async function shutdownWithReport(config: ConfigFSBinder, sts:STS, bot: DiscordBotInterface, signal: string) {
    if(shuttingDown) return;
    shuttingDown = true;
    const hook = config.getWebhook().reportHookUrl;
    if (hook && hook !== INIT_SCAMMER_WH_URL) {
        const stats = sts.webhookHandler.getAllStats();
        const statuses: string[] = [];
        for (const key of Object.keys(stats)) {
            statuses.push(`${key}:\nSuccess: ${stats[key].success} Failed: ${stats[key].failed} Total: ${stats[key].total} `);
        }
        statuses.push("");
        const totalStats = sts.webhookHandler.getTotalStats();
        statuses.push(`Total: Success: ${totalStats.success} Failed: ${totalStats.failed} Total: ${totalStats.success}`);
        const content = `**Shutdown: ${signal}**\n${warpTripleQuote(statuses.join("\n"))}`;
        console.info(sanitizeString(content));

        try {
            if (bot) {
                const user = bot.client.user;
                await sts.webhookHandler.send(hook, {username: user.username, avatar_url: user.avatarURL({format: "png"}), content }, false);
            } else {
                await sts.webhookHandler.send(hook, { username: "STS report", content }, false);
            }
        } catch (error) {
            // ignore
        }
    }
    if (bot) {
        bot.client.destroy();
    }
    process.exit(0);
}
