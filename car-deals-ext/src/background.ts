import { sites } from "./constants";
import { didScrapeToday, startScrape, updateLastScrapeDate } from "./lib/background/scrape";

(async () => {
    try {
        const didScrape = await didScrapeToday();
        if (didScrape) return;

        // run once on load or whenever the extension is reloaded
        await startScrape(sites);
        await updateLastScrapeDate();
    } catch (error) {
        console.error("Error in background script", error)
    }
})()