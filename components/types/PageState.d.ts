type PageState = {
    lat: number
    lng: number
    zoom: number
    daysInPastShown: number
    quickLink?: PresetLocation
    featureFlags: string[]
}