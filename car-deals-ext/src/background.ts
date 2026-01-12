import browser from "webextension-polyfill";
import { ApiData, SiteData } from "./types";
import { sleep } from "./lib/sleep";

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete') return;
    // console.log("tab: ", tab);
})

const waitForTab = async (tabId: number) => {
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
const sites: SiteData[] = [
    {
        url: "https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?fuelTypes=3&searchId=f1da590c-ce28-4e40-9d6c-cc7b126a3309&zip=92804&distance100&entitySelectingHelper.selectedEntity=d3215&sourceContext=carGurusHomePageModel&sortDir=ASC&sortType=PRICE&makeModelTrimPaths=m42%2Fd3215&makeModelTrimPaths=m42&srpVariation=DEFAULT_SEARCH&isDeliveryEnabled=true&shouldPersistSortSelection=true&nonShippableBaseline=89&startYear=2025&endYear=2025",
        container: "#cargurus-listing-search [data-testid='srp-tiles']",
        tile: '[data-testid="srp-listing-tile"]',
        title: '[data-testid="srp-tile-listing-title"] h4',
        subTitle: `[data-testid="srp-tile-listing-title"] div:nth-child(2) p`,
        price: '[data-testid="srp-tile-price"]',
        sleepBeforeStartDuration: 5000
    },
    {
        url: "https://www.autotrader.com/cars-for-sale/hybrid/2025/mazda/cx-50/anaheim-ca?listingType=CERTIFIED&listingType=USED&searchRadius=100&sortBy=derivedpriceASC&zip=92804",
        container: "#srp-listings",
        tile: ".inventory-listing",
        title: ".title-info h2",
        subTitle: ".specifications",
        price: '[data-cmp="pricing"]',
        sleepBeforeStartDuration: 8000
    }
];


const startScrape = async () => {
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

        const body = {
            hostname: new URL(site.url).hostname,
            data: response.payload
        }

        fetch("http://localhost:3000/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }
};

// runs every 12hr
setInterval(() => {
    startScrape()
}, 60 * 60 * 1000 * 12);

// run once on load
startScrape();
