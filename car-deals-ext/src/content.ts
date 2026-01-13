import browser from "webextension-polyfill";
import { ApiData, SiteData } from "./types";
import { sleep } from "./lib/shared/sleep";

console.log("Content script loaded");
type Responses =
    | { type: "PONG" }
    | { type: "SCRAPING_STARTED"; payload: any };


browser.runtime.onMessage.addListener(
    (message: any, _sender: any, sendResponse: (response: Responses) => void) => {
        console.log("message", message)
        if (message.id !== "CAR_EXT") return true;
        switch (message.type) {
            case "PING":
                console.log("Content script: Received PING messgage");
                sendResponse({ type: "PONG" });
                break;
            case 'START_SCRAPING':
                (async () => {
                    const res = await scrapeFirstPageResults(message.data);
                    sendResponse({ type: "SCRAPING_STARTED", payload: res });
                })();
                return true;
            default:
                console.log("Content script: Message type invalid")
                break;
        }
        return true;
    }
);

const scrapeFirstPageResults = async (data: SiteData) => {
    console.log("Content script: scrapeFirstPageResults data: ", data)
    if (data.sleepBeforeStartDuration) await sleep(data.sleepBeforeStartDuration)
    const containerEle = document.querySelector(data.container);
    if (!containerEle) {
        console.log("Content script: No container")
        return;
    }

    const apiData: ApiData[] = [];

    const tileEles = document.querySelectorAll(data.tile);
    if (!tileEles || tileEles.length === 0) {
        console.log("Content script: No tiles")
        return;
    }

    for (const tile of Array.from(tileEles)) {
        const titleEle = tile.querySelector(data.title);
        console.log("tile", tile, titleEle)
        if (!titleEle) {
            console.log("Content script: No title")
            continue;
        }
        const title = titleEle.textContent.trim();

        const subTitleEle = tile.querySelector(data.subTitle);
        if (!subTitleEle) {
            console.log("Content script: No sub title")
            continue;
        }
        const subTitle = subTitleEle.textContent.trim();

        const priceEle = tile.querySelector(data.price);
        if (!priceEle) {
            console.log("Content script: No price")
            continue;
        }
        const price = priceEle.textContent.trim();


        const parsedPrice = parseFloat(price.replace(/[^0-9.]/g, ''));


        const formattedData: ApiData = {
            url: data.url,
            title,
            subTitle,
            price,
            parsedPrice
        }

        apiData.push(formattedData);
    }

    const sortedData = [...apiData].sort((a, b) => a.parsedPrice - b.parsedPrice);
    console.log("Content script: sortedData", sortedData);
    return sortedData
}