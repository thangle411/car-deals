import browser from "webextension-polyfill";
import { ApiData, SiteData } from "../../types";
import { waitForTab } from "./waitForTab";
import { doFetch } from "../shared/fetch";

export const handleScrape = async (sites: SiteData[]) => {
    const didScrape = await didScrapeToday();
    if (didScrape) return;
    await startScrape(sites);
    await updateLastScrapeDate();
}

export const startScrape = async (sites: SiteData[], keyword?: string) => {
    for (const site of sites) {
        console.log("site: ", site);

        const newTab = await browser.tabs.create({ url: site.url, active: false, pinned: true });

        if (!newTab.id) {
            console.error("No tab id");
            return
        };

        console.log("newTab", newTab)

        const isTabReady = await waitForTab(newTab.id);
        console.log("res from tab: ", isTabReady);

        if (!isTabReady) {
            console.log("Tab is not ready")
            return
        }

        const response: { payload: ApiData[] } = await browser.tabs.sendMessage(newTab.id, { type: "START_SCRAPING", id: "CAR_EXT", data: site });
        console.log("response: ", response)

        await browser.tabs.remove(newTab.id);

        const filteredData = response.payload.filter((item) =>
            item.title.toLowerCase().includes(keyword?.toLowerCase() || "")
            || item.subTitle.toLowerCase().includes(keyword?.toLowerCase() || "")
        );

        console.log("keyword", keyword);
        console.log("filteredData", filteredData);

        const body = {
            hostname: new URL(site.url).hostname,
            data: filteredData
        }

        doFetch({
            url: `${process.env.BACKEND_URL}/submit`,
            options: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
        })
    }
};


export const didScrapeToday = async () => {
    const today = new Date();
    const now = today.toISOString().split("T")[0];
    const { lastScrapeDate } = await browser.storage.local.get("lastScrapeDate");
    console.log("lastScrapeDate", lastScrapeDate)
    if (lastScrapeDate === now) {
        console.log("Already scraped today")
        return true;
    }
    return false;
}

export const updateLastScrapeDate = async () => {
    const today = new Date();
    const now = today.toISOString().split("T")[0];
    await browser.storage.local.set({ lastScrapeDate: now });
}