type PageState = {
    lat: number
    lng: number
    zoom: number
    daysInPastShown: number
    quickLink?: PresetLocation
    screenshotMode: ScreenshotMode | null
}