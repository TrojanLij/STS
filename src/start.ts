import { ConfigFSBinder } from "./configFSBinder";

export function start(configBinder: ConfigFSBinder) {

    if (DEVELOPMENT) {
        console.log(configBinder.getConfig(), configBinder.getWebhook());
    }
}
