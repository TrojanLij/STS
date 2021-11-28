import { WebhookMessageOptions } from "discord.js";
import EventEmitter from "events";


export enum CLIEvents {
    Help = "help",
    Status = "status",
    QrCode = "qr-code",
}
export const cliEvents: CliEventDescription[] = [
    { event: CLIEvents.Help, alias: ["help", "?"], info: "Shows available commands" },
    { event: CLIEvents.Status, alias: ["homo", "status"], info: "Shows status" },
    { event: CLIEvents.QrCode, alias: ["rr",], info: "Sends mysterious qrcode" },
];

interface CliEventDescription {
    event: CLIEvents;
    alias: string[];
    info: string;
    args?: string[][];
}

export interface CLIEvent<T = any> {
    reply: (message: WebhookMessageOptions) => Promise<void>;
    originalInput: string;
    command: string;
    args: string[]
    data: T;
}

interface CLIEventsDeclaration {
    [CLIEvents.Status]: CLIEvent<string>;
    [CLIEvents.Help]: CLIEvent<string>;
    [CLIEvents.QrCode]: CLIEvent<null>;
}

export abstract class AppInput {
    private eventListener = new EventEmitter();

    protected emit(value: CLIEvents.QrCode, event: CLIEvent<string>): this;
    protected emit(value: CLIEvents.Status, event: CLIEvent<string>): this;
    protected emit(value: CLIEvents.Help, event: CLIEvent<string>): this;
    protected emit<T>(value: string, event: CLIEvent<T>) {
        this.eventListener.emit(value, event);
        return this;
    }

    on(value: CLIEvents.QrCode, listener: (event: CLIEventsDeclaration[CLIEvents.QrCode]) => void): this;
    on(value: CLIEvents.Status, listener: (event: CLIEventsDeclaration[CLIEvents.Status]) => void): this;
    on(value: CLIEvents.Help, listener: (event: CLIEventsDeclaration[CLIEvents.Help]) => void): this;
    on(value: string, listener: (...args: any[]) => void) {
        this.eventListener.on(value, listener);
        return this;
    }

    off(value: CLIEvents.QrCode, listener: (event: CLIEventsDeclaration[CLIEvents.QrCode]) => void): this;
    off(value: CLIEvents.Help, listener: (event: CLIEventsDeclaration[CLIEvents.Help]) => void): this;
    off(value: string, listener: (...args: any[]) => void) {
        this.eventListener.off(value, listener);
        return this;
    }
}
