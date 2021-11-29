import { WebhookMessageOptions } from "discord.js";
import EventEmitter from "events";

export enum CLIEvents {
    Help = "help",
    Status = "status",
    CloseHook = "close-hook",
    CheckHook = "check-hook",
    ConfigHookRemove = "cfg-hook-remove",
    ConfigHookAdd = "cfg-hook-add",
    HooksStatuses = "hooks-status",
    UpdateReportHook = "update-report-hooks",
    Embeds = "test-embeds",
    QrCode = "qr-code",
}
export const cliEvents: CliEventDescription[] = [
    {
        event: CLIEvents.Help,
        alias: ["help", "?"],
        info: "Shows available commands" },
    {
        event: CLIEvents.Status,
        alias: ["homo", "status"],
        info: "Shows status"
    },
    {
        event: CLIEvents.CloseHook,
        alias: ["close-hook", "close-webhook", "del-hook", "del-webhook", "rm-hook", "rm-webhook"],
        info: "<webhook urls*> - Sends DELETE request to hook",
        args: [
            { name: "webhook-url", description: "Webhook url", required: true}
        ]
    },
    {
        event: CLIEvents.CheckHook,
        alias: ["check-hook", "check-webhook"],
        info: "<webhook urls*> - Check for hook",
        args: [
            { name: "webhook-url", description: "Webhook url", required: true}
        ] },
    {
        event: CLIEvents.ConfigHookRemove,
        alias: ["cfg-hook-remove", "chr"],
        info: "<webhook urls*> - Removes hooks from webhook.json",
        args: [
            { name: "webhook-url", description: "Webhook url", required: true}
        ] },
    {
        event: CLIEvents.ConfigHookAdd,
        alias: ["cfg-hook-add", "cha"],
        info: "<webhook urls*> - Adds hooks to webhooks.json",
        args: [
            { name: "webhook-url", description: "Webhook url", required: true}
        ]
    },
    {
        event: CLIEvents.HooksStatuses,
        alias: ["hooks-stats", "hook-stats"],
        info: "Hooks stats",
    },
    {
        event: CLIEvents.UpdateReportHook,
        alias: ["update-report-hook", "report-hook"],
        info: "<webhook url> - Update report hook",
        args: [
            { name: "webhook-url", description: "Webhook url", required: false}
        ]},
    {
        event: CLIEvents.Embeds,
        alias: ["test-embeds"],
        info: "Displays all embeds" },

    {
        event: CLIEvents.QrCode, alias: ["rr"],
        info: "Sends mysterious qrcode"
    },
];

interface CliEventDescription {
    event: CLIEvents;
    alias: string[];
    info: string;
    args?: Arg[];
}

interface Arg {
    name: string;
    description: string;
    required: boolean;
    choices?: string[];
}

export interface CLIEvent<T = any> {
    reply: (message: WebhookMessageOptions) => Promise<void>;
    originalInput: string;
    command: string;
    args: string[]
    data: T;
}

export abstract class AppInput {
    private eventListener = new EventEmitter();

    protected emit(value: CLIEvents.Embeds, event: CLIEvent): this;
    protected emit(value: CLIEvents.UpdateReportHook, event: CLIEvent): this;
    protected emit(value: CLIEvents.HooksStatuses, event: CLIEvent): this;
    protected emit(value: CLIEvents.ConfigHookAdd, event: CLIEvent): this;
    protected emit(value: CLIEvents.ConfigHookRemove, event: CLIEvent): this;
    protected emit(value: CLIEvents.CheckHook, event: CLIEvent): this;
    protected emit(value: CLIEvents.CloseHook, event: CLIEvent): this;
    protected emit(value: CLIEvents.QrCode, event: CLIEvent): this;
    protected emit(value: CLIEvents.Status, event: CLIEvent): this;
    protected emit(value: CLIEvents.Help, event: CLIEvent): this;
    protected emit<T>(value: string, event: CLIEvent<T>) {
        this.eventListener.emit(value, event);
        return this;
    }

    on(value: CLIEvents.Embeds, listener: (event: CLIEvent) => void): this;
    on(value: CLIEvents.UpdateReportHook, listener: (event: CLIEvent) => void): this;
    on(value: CLIEvents.HooksStatuses, listener: (event: CLIEvent) => void): this;
    on(value: CLIEvents.ConfigHookRemove, listener: (event: CLIEvent) => void): this;
    on(value: CLIEvents.ConfigHookAdd, listener: (event: CLIEvent) => void): this;
    on(value: CLIEvents.CheckHook, listener: (event: CLIEvent) => void): this;
    on(value: CLIEvents.CloseHook, listener: (event: CLIEvent) => void): this;
    on(value: CLIEvents.QrCode, listener: (event: CLIEvent) => void): this;
    on(value: CLIEvents.Status, listener: (event: CLIEvent) => void): this;
    on(value: CLIEvents.Help, listener: (event: CLIEvent) => void): this;
    on(value: string, listener: (...args: any[]) => void) {
        this.eventListener.on(value, listener);
        return this;
    }

    off(value: CLIEvents.Embeds, listener: (event: CLIEvent) => void): this;
    off(value: CLIEvents.UpdateReportHook, listener: (event: CLIEvent) => void): this;
    off(value: CLIEvents.HooksStatuses, listener: (event: CLIEvent) => void): this;
    off(value: CLIEvents.ConfigHookRemove, listener: (event: CLIEvent) => void): this;
    off(value: CLIEvents.ConfigHookAdd, listener: (event: CLIEvent) => void): this;
    off(value: CLIEvents.CheckHook, listener: (event: CLIEvent) => void): this;
    off(value: CLIEvents.CloseHook, listener: (event: CLIEvent) => void): this;
    off(value: CLIEvents.QrCode, listener: (event: CLIEvent) => void): this;
    off(value: CLIEvents.Help, listener: (event: CLIEvent) => void): this;
    off(value: string, listener: (...args: any[]) => void) {
        this.eventListener.off(value, listener);
        return this;
    }
}
