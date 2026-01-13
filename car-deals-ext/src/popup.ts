import browser from "webextension-polyfill";

console.log("Popup loaded");

const handleForceScrape = () => {
    console.log("Force scrape clicked");
    browser.runtime.sendMessage({ type: "FORCE_SCRAPING" });
}

const scrapeButton = document.getElementById("scrape");
scrapeButton?.addEventListener("click", handleForceScrape);