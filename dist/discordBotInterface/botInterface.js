"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordBotInterface = void 0;
const discord_js_1 = require("discord.js");
const constants_1 = require("../constants");
const commandHandler_1 = require("./commandHandler");
class DiscordBotInterface {
    constructor(config) {
        this.config = config;
        this.statusUpdateLimit = 15 * constants_1.SECOND;
        this.lastUpdate = 0;
    }
    async init() {
        if (this._client) {
            return;
        }
        const token = this.config.getConfig().token;
        if (!token || token === constants_1.INIT_TOKEN) {
            throw new Error("Discord bot token not provided!");
        }
        const client = new discord_js_1.Client({
            intents: [
                discord_js_1.Intents.FLAGS.GUILDS,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
            ],
        });
        await client.login(token);
        this._commandInterface = new commandHandler_1.CommandHandler(this.config, client);
        console.info("Starting discord bot!");
        await this._commandInterface.init();
        console.info(`Discord bot started as "${client.user.tag}"`);
        this._client = client;
        this.setStatus("Waiting");
    }
    setStatus(msg) {
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
exports.DiscordBotInterface = DiscordBotInterface;
