import browser from "webextension-polyfill";
import { sites } from "./constants";
import { handleScrape, startScrape } from "./lib/background/scrape";

(async () => {
    try {
        // run once on load or whenever the extension is reloaded
        await handleScrape(sites);
    } catch (error) {
        console.error("Error in background script", error)
    }
})()

browser.action.onClicked.addListener(async () => {
    await handleScrape(sites);
})
browser.runtime.onMessage.addListener((message: unknown, sender, sendResponse) => {
    if (typeof message === "object" && message !== null && "type" in message) {
        switch (message.type) {
            case "START_SCRAPING":
                handleScrape(sites);
                break;
            case "FORCE_SCRAPING":
                startScrape(sites);
                break;
            default:
                console.log("Background script: Message type invalid")
                break;
        }
    }
    return true;
})