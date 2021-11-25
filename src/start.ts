import { ConfigFSBinder } from "./configFSBinder";
import { FakeAccount } from "./fakeProfile";

export function start(configBinder: ConfigFSBinder) {
    const account = new FakeAccount();
    console.log(account.discord.avatar);
    if (DEVELOPMENT) {
        console.log(configBinder.getConfig(), configBinder.getWebhook());
    }
}
