import { Client, Intents } from "discord.js";
import { ConfigBinder } from "../interfaces";
import { INIT_TOKEN, SECOND } from "../constants";
import { CommandHandler } from "./commandHandler";


export class DiscordBotInterface {
    private readonly statusUpdateLimit = 15 * SECOND;
    private _client: Client;
    private lastUpdate = 0;
    private frameUpdate: NodeJS.Timeout;
    private _commandInterface: CommandHandler;

    constructor(private config: ConfigBinder) {}
    async init() {
        if (this._client) {
            return;
        }
        const token = this.config.getConfig().token;
        if (!token || token === INIT_TOKEN) {
            throw new Error("Discord bot token not provided!");
        }
        const client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
            ],
        });
        await client.login(token);
        this._commandInterface = new CommandHandler(this.config, client);
        console.info("Starting discord bot!");
        await this._commandInterface.init();
        console.info(`Discord bot started as "${client.user.tag}"`);
        this._client = client;
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
        if (this._client.user) {
            this._client.user.setPresence({
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
    get commandInterface() {
        return this._commandInterface;
    }
    get client() {
        return this._client;
    }
}
