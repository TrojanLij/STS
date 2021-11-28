import { ConfigFSBinder } from "../configFSBinder";
import { Client, DMChannel, NewsChannel, PartialDMChannel, TextChannel, ThreadChannel, WebhookMessageOptions } from "discord.js";
import { AppInput, CLIEvent, cliEvents } from "../appInput";
import { getArgsRaw } from "../utils";

export class CommandHandler extends AppInput{
    constructor(config: ConfigFSBinder, client: Client) {
        super();
        client.on("messageCreate", msg => {
            if (msg.author.bot) return;
            if (msg.type !== "DEFAULT") return;
            const prefix = config.getConfig().prefix;
            if (msg.content.startsWith(prefix)) {
                const args = getArgsRaw(msg.content);
                const command = args.shift().toLowerCase();
                for (const cliEvent of cliEvents) {
                    if (cliEvent.alias.includes(command)) {
                        this.emit(cliEvent.event as any, this.createBaseEvent(msg.content, null, msg.channel));
                        return;
                    }
                }
            }
        });
    }


    private createBaseEvent<T = any>(line: string, data: T, channel: DMChannel | PartialDMChannel | TextChannel | NewsChannel | ThreadChannel) {
        const args = getArgsRaw(line);
        const argsCopy = [...args];
        const command = argsCopy.shift().toLowerCase();

        const event: CLIEvent<T> = {
            originalInput: line,
            command,
            args,
            data,
            reply: (msg: WebhookMessageOptions) => channel.send(msg) as unknown as Promise<void>,
        };
        return event;
    }
}
