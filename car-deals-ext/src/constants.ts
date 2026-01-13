import { SiteData } from "./types";

export const sites: SiteData[] = [
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