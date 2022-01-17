// If the zoom is set, it appears as a button option
// If the zoom is not set, it is used to match approx locations
type LocationPreset = {
    title:string
    urlParam:string
    matchingMohCityString:string[] // TODO: convert to Dict
    lat:number
    lng:number
    zoom:number
    showInDrawer: boolean
  }
  