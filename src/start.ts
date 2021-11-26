import { ConfigFSBinder } from "./configFSBinder";
import { getUserLogonEmbed } from "./embeds/login";

export async function start(config: ConfigFSBinder) {
    let i = 0;
    console.log("runnnign--0")
    while(true) {
        const msg = await getUserLogonEmbed(config);
        i++;
        if(msg.embeds[1].description.startsWith("<")) {
            console.log(msg.embeds[1].description.split("\n"));
            console.log(i, msg.embeds[1].title);
            break;//
        } else {
            console.log(i);
        }
    }
    // if (DEVELOPMENT) {
    //     console.log(config.getConfig(), config.getWebhook());
    // }
}
