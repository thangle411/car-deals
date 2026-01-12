export type SiteData = {
    url: string,
    container: string,
    tile: string,
    title: string,
    subTitle: string,
    price: string,
    // some sites we need to sleep a bit to let all DOM elements load
    sleepBeforeStartDuration?: number;
}

export type ApiData = {
    url: string,
    title: string,
    subTitle: string,
    price: string,
    parsedPrice: number,
}