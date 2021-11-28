"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
const appInput_1 = require("../appInput");
const utils_1 = require("../utils");
const builders_1 = require("@discordjs/builders");
const rest_1 = require("@discordjs/rest");
const log_1 = require("./../log");
const v9_1 = require("discord-api-types/v9");
const apiVersion = 9;
class CommandHandler extends appInput_1.AppInput {
    constructor(config, client) {
        super();
        this.config = config;
        this.client = client;
        this.onInteraction = (interaction) => {
            if (!interaction.isCommand())
                return;
            const command = interaction.commandName.toLowerCase();
            for (const cliEvent of appInput_1.cliEvents) {
                if (cliEvent.alias.includes(command)) {
                    const args = [];
                    if (cliEvent.args) {
                        for (const arg of cliEvent.args) {
                            args.push(interaction.options.getString(arg.name));
                        }
                    }
                    const mockCommand = `${command} ${args.join(" ")}`;
                    let sent = false;
                    this.emit(cliEvent.event, this.createBaseEvent(mockCommand, interaction, payload => {
                        if (sent) {
                            return interaction.followUp(payload);
                        }
                        else {
                            sent = true;
                            return interaction.reply(payload);
                        }
                    }));
                    return;
                }
            }
            interaction.reply(`${command}: command not found`);
        };
        this.onMessage = (msg) => {
            if (msg.author.bot)
                return;
            if (msg.type !== "DEFAULT")
                return;
            const prefix = this.config.getConfig().prefix;
            if (msg.content.startsWith(prefix)) {
                const args = (0, utils_1.getArgsRaw)(msg.content);
                const command = args.shift().toLowerCase().slice(prefix.length);
                for (const cliEvent of appInput_1.cliEvents) {
                    if (cliEvent.alias.includes(command)) {
                        this.emit(cliEvent.event, this.createBaseEvent(msg.content, msg, payload => msg.channel.send(payload)));
                        return;
                    }
                }
                msg.channel.send(`${command}: command not found`);
            }
        };
        client.on("messageCreate", this.onMessage);
        client.on("interactionCreate", this.onInteraction);
    }
    async init() {
        const commands = this.createSlashCommands();
        await this.announceSlashCommands(this.client, commands);
    }
    destroy() {
        this.client.removeListener("messageCreate", this.onMessage);
        this.client.removeListener("interactionCreate", this.onInteraction);
    }
    createSlashCommands() {
        const slashCommands = [];
        for (const cliEvent of appInput_1.cliEvents) {
            const slashCommand = new builders_1.SlashCommandBuilder();
            slashCommand.setName(cliEvent.alias[0]);
            slashCommand.setDescription(cliEvent.info);
            if (cliEvent.args) {
                for (const arg of cliEvent.args) {
                    slashCommand.addStringOption((option) => {
                        const opt = option
                            .setName(arg.name)
                            .setDescription(arg.description)
                            .setRequired(arg.required);
                        if (arg.choices) {
                            for (let i = 0; i < arg.choices.length; i++) {
                                opt.addChoice(arg.choices[i], arg.choices[i]);
                            }
                        }
                        return opt;
                    });
                }
            }
            slashCommands.push(slashCommand);
        }
        return slashCommands;
    }
    async announceSlashCommands(client, slashCommands) {
        const body = slashCommands.map((c) => c.toJSON());
        const rest = new rest_1.REST({ version: apiVersion.toString() }).setToken(client.token);
        const guilds = client.guilds.cache.map(g => g);
        for (const guild of guilds) {
            try {
                await rest.put(v9_1.Routes.applicationGuildCommands(client.application.id, guild.id), { body });
            }
            catch (error) {
                const msg = `failed initialized commands on guild ${guild.name}(${guild.id})`;
                console.error(msg);
                (0, log_1.writeError)(error, msg);
            }
        }
    }
    createBaseEvent(line, data, reply) {
        const args = (0, utils_1.getArgsRaw)(line);
        const command = args.shift().toLowerCase();
        const event = {
            originalInput: line,
            command,
            args,
            data,
            reply,
        };
        return event;
    }
}
exports.CommandHandler = CommandHandler;
