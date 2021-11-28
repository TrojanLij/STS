import { WebhookMessageOptions } from "discord.js";
import { createInterface } from "readline";
import { ORIGINAL_METHODS } from "./log";

import { AppInput, CLIEvent, cliEvents } from "./appInput";
import { getArgsRaw, sanitizeString } from "./utils";

export class CLIHandler extends AppInput {
    private cli  = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    constructor() {
        super();

        this.spawnSummonCommand();

        for (const method of Object.keys(ORIGINAL_METHODS)) {
            //@ts-ignore
            console[method] = (...args: any[]) => {
                //@ts-ignore
                ORIGINAL_METHODS[method](...args);
                this.spawnSummonCommand();
            };

        }
    }

    private spawnSummonCommand() {
        const previousLine = this.cli.line;
        this.cli.write(null, { ctrl: true, name: "u" });
        this.cli.question("SIS> ", line => {
            if (!line) return this.spawnSummonCommand();
            const args = getArgsRaw(line);
            const command = args.shift().toLowerCase();
            for (const cliEvent of cliEvents) {
                if (cliEvent.alias.includes(command)) {
                    this.emit(cliEvent.event as any, this.createBaseEvent(line, null, this.writeOnConsole));
                    return;
                }
            }
            console.log(`${command}: command not found`);
        });
        this.cli.write(previousLine);
    }

    private consoleify(msg: WebhookMessageOptions){
        let stringBuilder: string[] = [];
        if (msg.content) stringBuilder.push(sanitizeString(msg.content));
        if (msg.username) stringBuilder.push(`Username: ${sanitizeString(msg.username)}`);
        //if (msg.avatarURL) stringBuilder.push(`avatarUrl: ${msg.avatarURL}`);
        if (msg.embeds) {
            const indentation = "   ";
            for (let i = 0; i < msg.embeds.length; i++) {
                const embed = msg.embeds[i];
                stringBuilder.push(`Embed(${i})`);
                if (embed.author?.name)       stringBuilder.push(`${indentation}author: ${sanitizeString(embed.author.name)}`);
                //if (embed.color)        stringBuilder.push(`${indentation}color: ${embed.color}`);
                if (embed.description)  stringBuilder.push(`${indentation}description: ${sanitizeString(embed.description)}`);
                // if (embed.thumbnail)  stringBuilder.push(`${indentation}thumbnail: ${embed.thumbnail}`);
                //if (embed.url)          stringBuilder.push(`${indentation}url: ${embed.url}`);
                if (embed.fields.length) {
                    const ident = indentation.repeat(2);
                    stringBuilder.push(`${indentation}Fields:`);
                    for (let j = 0; j < embed.fields.length; j++) {
                        stringBuilder.push(`${ident}${sanitizeString(embed.fields[j].name)}: ${sanitizeString(embed.fields[j].value)}`);
                    }
                }
                if (embed.footer?.text)       stringBuilder.push(`${indentation}footer: ${sanitizeString(embed.footer.text)}`);
            }
        }
        return stringBuilder.join("\n");
    }
    private writeOnConsole = async (msg: WebhookMessageOptions) => {
        console.log(this.consoleify(msg));
    };
    private createBaseEvent<T = any>(line: string, data: T, reply: (msg: WebhookMessageOptions) => Promise<void>) {
        const args = getArgsRaw(line);
        const argsCopy = [...args];
        const command = argsCopy.shift().toLowerCase();

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
