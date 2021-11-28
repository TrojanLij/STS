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
    CLIEvents["QrCode"] = "qr-code";
})(CLIEvents = exports.CLIEvents || (exports.CLIEvents = {}));
exports.cliEvents = [
    { event: CLIEvents.Help, alias: ["help", "?"], info: "Shows available commands" },
    { event: CLIEvents.Status, alias: ["homo", "status"], info: "Shows status" },
    { event: CLIEvents.QrCode, alias: ["rr",], info: "Sends mysterious qrcode" },
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
