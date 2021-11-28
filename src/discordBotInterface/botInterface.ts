import { Client, Intents } from "discord.js";
import { INIT_TOKEN, SECOND } from "../constants";


export class DiscordBotInterface {
    private readonly statusUpdateLimit = 15 * SECOND;
    private client: Client;
    private lastUpdate = 0;
    private frameUpdate: NodeJS.Timeout;

    constructor(private token: string) {}
    async init() {
        if (this.client) {
            return;
        }
        if (!this.token || this.token === INIT_TOKEN) {
            throw new Error("Discord bot not provided!");
        }
        const client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_WEBHOOKS,
                Intents.FLAGS.GUILD_MESSAGES,
            ],
        });
        await client.login(this.token);
        this.client = client;
        this.setStatus("Waiting");
    }
    setStatus(msg: string){
        const nextUpdate = this.lastUpdate + this.statusUpdateLimit;
        const now = Date.now();
        if (now < nextUpdate) {
            console.debug("ignore");
            if (this.frameUpdate) {
                clearTimeout(this.frameUpdate);
            }
            this.frameUpdate = setTimeout(() => {
                this.setStatus(msg);
                this.frameUpdate = undefined;
            });
            return;
        }
        if (this.client.user) {
            this.client.user.setPresence({
                activities: [
                    {
                        name: msg,
                        type: "PLAYING",
                    },
                ],
                status: "dnd",
            });
            this.lastUpdate = Date.now();
        }
    }
}
