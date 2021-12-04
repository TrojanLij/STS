import { start, StartReturn  } from "../sts/start";
import { ConfigBrowserBinder } from "./configBinder";

let sts: StartReturn;


//single tone
export default async function stsBrowser(): Promise<StartReturn> {
    const config = new ConfigBrowserBinder();
    if (sts) {
        return sts;
    }
    const s = await start(config);
    sts = s;
    return sts;
}


