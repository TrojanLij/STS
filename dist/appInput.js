"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppInput = exports.cliEvents = exports.CLIEvents = void 0;
const events_1 = __importDefault(require("events"));
var CLIEvents;
(function (CLIEvents) {
    CLIEvents["Help"] = "help";
    CLIEvents["Status"] = "status";
    CLIEvents["CloseHook"] = "close-hook";
    CLIEvents["CheckHook"] = "check-hook";
    CLIEvents["ConfigHookRemove"] = "cfg-hook-remove";
    CLIEvents["ConfigHookAdd"] = "cfg-hook-add";
    CLIEvents["HooksStatuses"] = "hooks-status";
    CLIEvents["UpdateReportHook"] = "update-report-hooks";
    CLIEvents["Embeds"] = "test-embeds";
    CLIEvents["QrCode"] = "qr-code";
})(CLIEvents = exports.CLIEvents || (exports.CLIEvents = {}));
exports.cliEvents = [
    {
        event: CLIEvents.Help,
        alias: ["help", "?"],
        info: "Shows available commands"
    },
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
            { name: "webhook-url", description: "Webhook url", required: true }
        ]
    },
    {
        event: CLIEvents.CheckHook,
        alias: ["check-hook", "check-webhook"],
        info: "<webhook urls*> - Check for hook",
        args: [
            { name: "webhook-url", description: "Webhook url", required: true }
        ]
    },
    {
        event: CLIEvents.ConfigHookRemove,
        alias: ["cfg-hook-remove", "chr"],
        info: "<webhook urls*> - Removes hooks from webhook.json",
        args: [
            { name: "webhook-url", description: "Webhook url", required: true }
        ]
    },
    {
        event: CLIEvents.ConfigHookAdd,
        alias: ["cfg-hook-add", "cha"],
        info: "<webhook urls*> - Adds hooks to webhooks.json",
        args: [
            { name: "webhook-url", description: "Webhook url", required: true }
        ]
    },
    {
        event: CLIEvents.HooksStatuses,
        alias: ["hooks-stats", "hook-stats"],
        info: "<webhook urls*> - Hooks stats",
        args: [
            { name: "webhook-url", description: "Webhook url", required: true }
        ]
    },
    {
        event: CLIEvents.UpdateReportHook,
        alias: ["update-report-hook", "report-hook"],
        info: "<webhook url> - Update report hook",
        args: [
            { name: "webhook-url", description: "Webhook url", required: false }
        ]
    },
    {
        event: CLIEvents.Embeds,
        alias: ["test-embeds"],
        info: "Displays all embeds"
    },
    {
        event: CLIEvents.QrCode, alias: ["rr"],
        info: "Sends mysterious qrcode"
    },
];
class AppInput {
    constructor() {
        this.eventListener = new events_1.default();
    }
    emit(value, event) {
        this.eventListener.emit(value, event);
        return this;
    }
    on(value, listener) {
        this.eventListener.on(value, listener);
        return this;
    }
    off(value, listener) {
        this.eventListener.off(value, listener);
        return this;
    }
}
exports.AppInput = AppInput;
