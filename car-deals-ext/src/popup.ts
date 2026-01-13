import browser from "webextension-polyfill";

console.log("Popup loaded");

const handleForceScrape = () => {
    console.log("Force scrape clicked");
    console.log("keywordInput", keywordInput?.value)
    browser.runtime.sendMessage({
        type: "FORCE_SCRAPING", payload: {
            keyword: keywordInput?.value || ""
        }
    });
}

const scrapeButton = document.getElementById("scrape");
scrapeButton?.addEventListener("click", handleForceScrape);

const keywordForm = document.getElementById("keyword-form");
keywordForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    handleForceScrape();
});

const keywordInput: HTMLInputElement | null = document.getElementById("keyword") as HTMLInputElement;