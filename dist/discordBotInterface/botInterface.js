"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordBotInterface = void 0;
const discord_js_1 = require("discord.js");
const constants_1 = require("../constants");
class DiscordBotInterface {
    constructor(token) {
        this.token = token;
        this.statusUpdateLimit = 15 * constants_1.SECOND;
        this.lastUpdate = 0;
    }
    async init() {
        if (this.client) {
            return;
        }
        if (!this.token || this.token === constants_1.INIT_TOKEN) {
            throw new Error("Discord bot not provided!");
        }
        const client = new discord_js_1.Client({
            intents: [
                discord_js_1.Intents.FLAGS.GUILDS,
                discord_js_1.Intents.FLAGS.GUILD_WEBHOOKS,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
            ],
        });
        await client.login(this.token);
        this.client = client;
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
exports.DiscordBotInterface = DiscordBotInterface;
