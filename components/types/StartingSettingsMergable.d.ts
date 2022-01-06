export type StartingSettingsMergeable = {
    startingLocation?:LatLng | null
    zoom:number | null
    daysInPastShown:number | null
    resetDraw: boolean | null
    quickLink: PresetLocation | null
  }