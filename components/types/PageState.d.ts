type PageState = {
    lat: number
    lng: number
    zoom: number
    daysInPastShown: number
    quickLink?: LocationPreset
    featureFlags: string[]
    homepage?:LocationPreset
}