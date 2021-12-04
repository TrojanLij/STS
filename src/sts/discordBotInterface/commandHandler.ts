import { ConfigBinder } from "../interfaces";
import { CacheType, Client, Interaction, Message, WebhookMessageOptions } from "discord.js";
import { AppInput, CLIEvent, cliEvents } from "../appInput";
import { getArgsRaw } from "../utils";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { writeError } from "./../log";
import { Routes } from "discord-api-types/v9";
const apiVersion = 9;

export class CommandHandler extends AppInput{
    constructor(private config: ConfigBinder, private client: Client) {
        super();
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

    private onInteraction = (interaction: Interaction<CacheType>) => {
        if (!interaction.isCommand()) return;
        const command = interaction.commandName.toLowerCase();
        for (const cliEvent of cliEvents) {
            if (cliEvent.alias.includes(command)) {
                const args: string[] = [];
                if(cliEvent.args) {
                    for (const arg of cliEvent.args) {
                        args.push(interaction.options.getString(arg.name));
                    }
                }
                const mockCommand = `${command} ${args.join(" ")}`;
                let sent = false;
                this.emit(cliEvent.event as any, this.createBaseEvent(mockCommand, interaction, payload => {
                    if (sent) {
                        return interaction.followUp(payload) as unknown as Promise<void>;
                    } else {
                        sent = true;
                        return interaction.reply(payload) as Promise<void>;
                    }
                }));
                return;
            }
        }

        interaction.reply(`${command}: command not found`);
    };

    private onMessage = (msg: Message) => {
        if (msg.author.bot) return;
        if (msg.type !== "DEFAULT") return;
        const prefix = this.config.getConfig().prefix;
        if (msg.content.startsWith(prefix)) {
            const args = getArgsRaw(msg.content);
            const command = args.shift().toLowerCase().slice(prefix.length);
            for (const cliEvent of cliEvents) {
                if (cliEvent.alias.includes(command)) {
                    this.emit(cliEvent.event as any, this.createBaseEvent(msg.content, msg, payload => msg.channel.send(payload) as unknown as Promise<void>));
                    return;
                }
            }
            msg.channel.send(`${command}: command not found`);
        }
    };

    private createSlashCommands() {
        const slashCommands: SlashCommandBuilder[] = [];
        for (const cliEvent of cliEvents) {
            const slashCommand = new SlashCommandBuilder();
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
    private async announceSlashCommands(client: Client, slashCommands: SlashCommandBuilder[]) {
        const body = slashCommands.map((c) => c.toJSON());

        const rest = new REST({ version: apiVersion.toString() }).setToken(client.token);

        const guilds = client.guilds.cache.map(g => g);
        for (const guild of guilds) {
            try {
                await rest.put(
                    Routes.applicationGuildCommands(client.application.id, guild.id),
                    { body }
                );
            } catch (error) {
                const msg = `failed initialized commands on guild ${guild.name}(${guild.id})`;
                console.error(msg);
                writeError(error, msg);
            }
        }
    }

    private createBaseEvent<T = any>(line: string, data: T, reply: (msg: WebhookMessageOptions) => Promise<void>) {
        const args = getArgsRaw(line);
        const command = args.shift().toLowerCase();

        const event: CLIEvent<T> = {
            originalInput: line,
            command,
            args,
            data,
            reply,
        };
        return event;
    }
}
