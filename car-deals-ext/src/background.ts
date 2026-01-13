import browser from "webextension-polyfill";
import { sites } from "./constants";
import { handleScrape, startScrape } from "./lib/background/scrape";

let isScraping = false;

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
browser.runtime.onMessage.addListener((message: any, sender, sendResponse) => {
    console.log("Background script: Received message", message);
    (async () => {
        switch (message.type) {
            case "START_SCRAPING":
                handleScrape(sites);
                break;
            case "FORCE_SCRAPING":
                if (isScraping) return;
                isScraping = true;
                await startScrape(sites, message.payload.keyword);
                isScraping = false;
                break;
            default:
                console.log("Background script: Message type invalid")
                break;
        }
    })();
    return true;
})