"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIHandler = void 0;
const readline_1 = require("readline");
const log_1 = require("./log");
const appInput_1 = require("./appInput");
const utils_1 = require("./utils");
class CLIHandler extends appInput_1.AppInput {
    constructor() {
        super();
        this.cli = (0, readline_1.createInterface)({
            input: process.stdin,
            output: process.stdout,
        });
        this.writeOnConsole = async (msg) => {
            console.log(this.consoleify(msg));
        };
        this.spawnSummonCommand();
        for (const method of Object.keys(log_1.ORIGINAL_METHODS)) {
            //@ts-ignore
            const met = console[method];
            //@ts-ignore
            console[method] = (...args) => {
                //@ts-ignore
                met(...args);
                this.spawnSummonCommand();
            };
        }
    }
    spawnSummonCommand() {
        const previousLine = this.cli.line;
        this.cli.write(null, { ctrl: true, name: "u" });
        this.cli.question("SIS> ", line => {
            if (!line)
                return this.spawnSummonCommand();
            const args = (0, utils_1.getArgsRaw)(line);
            const command = args.shift().toLowerCase();
            for (const cliEvent of appInput_1.cliEvents) {
                if (cliEvent.alias.includes(command)) {
                    this.emit(cliEvent.event, this.createBaseEvent(line, null, this.writeOnConsole));
                    return;
                }
            }
            console.log(`${command}: command not found`);
        });
        this.cli.write(previousLine);
    }
    consoleify(msg) {
        let stringBuilder = [""];
        if (msg.content)
            stringBuilder.push((0, utils_1.sanitizeString)(msg.content));
        if (msg.username)
            stringBuilder.push(`Username: ${(0, utils_1.sanitizeString)(msg.username)}`);
        //if (msg.avatarURL) stringBuilder.push(`avatarUrl: ${msg.avatarURL}`);
        if (msg.embeds) {
            const indentation = "   ";
            for (let i = 0; i < msg.embeds.length; i++) {
                const embed = msg.embeds[i];
                stringBuilder.push(`Embed(${i})`);
                if (embed.author?.name)
                    stringBuilder.push(`${indentation}author: ${(0, utils_1.sanitizeString)(embed.author.name)}`);
                //if (embed.color)        stringBuilder.push(`${indentation}color: ${embed.color}`);
                if (embed.description)
                    stringBuilder.push(`${indentation}description: ${(0, utils_1.sanitizeString)(embed.description)}`);
                // if (embed.thumbnail)  stringBuilder.push(`${indentation}thumbnail: ${embed.thumbnail}`);
                //if (embed.url)          stringBuilder.push(`${indentation}url: ${embed.url}`);
                if (embed.fields.length) {
                    const ident = indentation.repeat(2);
                    stringBuilder.push(`${indentation}Fields:`);
                    for (let j = 0; j < embed.fields.length; j++) {
                        stringBuilder.push(`${ident}${(0, utils_1.sanitizeString)(embed.fields[j].name)}: ${(0, utils_1.sanitizeString)(embed.fields[j].value)}`);
                    }
                }
                if (embed.footer?.text)
                    stringBuilder.push(`${indentation}footer: ${(0, utils_1.sanitizeString)(embed.footer.text)}`);
            }
        }
        return stringBuilder.join("\n");
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
exports.CLIHandler = CLIHandler;
