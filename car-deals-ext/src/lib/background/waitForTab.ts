import browser from "webextension-polyfill";
import { sleep } from "../shared/sleep";

export const waitForTab = async (tabId: number) => {
    let isTabLoaded;
    let tries = 0;
    while (!isTabLoaded && tries < 10) {
        try {
            const res: any = await browser.tabs.sendMessage(tabId, { type: "PING", id: "CAR_EXT" });
            console.log("tab loaded", res);
            isTabLoaded = res.type === "PONG"
            return true;
        } catch (error) {
            console.log("tab not ready")
        }
        await sleep(1000);
        tries++;
    }

    return false;
}