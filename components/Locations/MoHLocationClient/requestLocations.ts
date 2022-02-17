import { applyLocationOverrides, isRelated, mapLoITOLoIRecord } from "../LocationObjectHandling";
import get, { AxiosResponse, AxiosPromise } from 'axios'
import LocationOfInterest from "../../types/LocationOfInterest";

const reallyBadDataFixes = (loi:LocationOfInterestRecord) => {
  if(loi.id == 'a0l4a0000006v95AAA' && !loi.city.length){
    loi.city = 'Rotorua'
  }

  if(['a0l4a0000006wceAAA','a0l4a0000006wcjAAA'].some((r) => r === loi.id) && loi.city.length == 0){
    loi.city = 'Auckland'
    loi.lat = -37.0036884804696
    loi.lng = 174.78644185846255
  }

  if(loi.id == 'a0l4a0000006yzUAAQ'){
    loi.city = 'Hamilton'
  }

  if(loi.id == 'a0l4a00000076rFAAQ'){
    loi.event = 'Islamic Centre Masjid Frankton'
  }

  return loi
}
type Airport = {
  lat:number
  lng:number
  city:string
}

type FlightCities = {
  startAirport:Airport
  finishAirport:Airport
}


const airports:Airport[] = [{
  lat: -41.3276189713988,
  lng: 174.80763135606952,
  city: 'Wellington'
},{
  lat: -38.10849472685444, 
  lng: 176.31571409267144,
  city: 'Rotorua'
},{
  lat: -39.46646834271194, 
  lng: 176.87227676315834,
  city: 'Napier'
},{
  lat: -39.010609293434136, 
  lng: 174.17919315853888,
  city: 'New Plymouth'
},
{
  lat:-37.001914423668026, 
  lng: 174.78945994070537,
  city: 'Auckland'
},{
  lat: -41.29812908598046, 
  lng: 173.2260873876426,
  city:'Nelson'
},{
  lat: -43.48821758604126, 
  lng: 172.53971640804374,
  city: 'Christchurch'
},{
  lat: -44.30325066125988, 
  lng: 171.22553003109553,
  city: 'Timaru'
},{
  lat: -41.32800475000787, 
  lng: 174.81088408855183,
  city: 'Wellington'
},{
  lat: -38.66188827874503, 
  lng: 177.98228170398286,
  city: 'Gisborne'
},{
  lat: -36.23994685472316, 
  lng: 175.46783618415506,
  city: 'Great Barrier'
}, {
  lat: -45.01979136980796, 
  lng: 168.74518418004115,
  city: 'Queenstown'
},{
  lat: -21.202443951624982, 
  lng: -159.8063960284597,
  city: 'Rarotonga'
},{
  lat: -40.32111606955561, 
  lng: 175.61774358397653,
  city: 'Palmerston North'
},{
  lat: -45.925906236592276, 
  lng: 170.20210372879743,
  city: 'Dunedin'
},{
  lat: -37.67218770667664, 
  lng: 176.19681211797678,
  city: 'Tauranga'
}]

const getCityFromEventRegex = new RegExp(/(\w+)\s*(\-|to)\s*(.+)/g)


const getAirportCities = (loi:LocationOfInterestRecord):FlightCities|undefined => {
    let startCity:string, finishCity:string

    let result;
    while ((result = getCityFromEventRegex.exec(loi.event)) !== null) {
      //let matchIndex = result.index;
      if(result.length > 3){
          
        startCity = result[result.length-3]
      
        finishCity = result[result.length-1]
        
      }
      //let t = result[0].length;
      //matchRanges.push(new RegRange(matchIndex, t));
  }

  const startAirport = airports.filter((ap) => ap.city === startCity)[0]
  const finishAirport = airports.filter((ap) => ap.city === finishCity)[0]
  
    if(startAirport && finishAirport){
        return {startAirport,finishAirport}
    }else{
      console.error(`no two matching airports for ${loi.event} [${startAirport},${finishAirport}]`)
     // throw `no two matching airports for ${loi.event}`
    }
}

const isFlight = (loi:LocationOfInterestRecord) => loi.event.startsWith('Flight') && loi.lat === 0 && loi.lng === 0

const createFlightLocations = (locations:LocationOfInterestRecord[]):LocationOfInterestRecord[] => {
  const resultantLocations = locations.filter((l) => !isFlight(l));
  const flightLocations = locations.filter(isFlight);
  flightLocations.forEach((fl) => {
    try{
      const airportCities = getAirportCities(fl);

      const startLoc:LocationOfInterestRecord = { 
          id: `${fl.id}_source`,
          mohId: fl.id,
          location: fl.location,
          event: fl.event,
          start: fl.start,
          end: fl.end,
          updated: fl.updated,
          added: fl.added,
          advice: fl.advice,
          exposureType: fl.exposureType,
          visibleInWebform: fl.visibleInWebform,
          city: airportCities ? airportCities.startAirport.city : fl.city,
          lat: airportCities ? airportCities.startAirport.lat : fl.lat,
          lng: airportCities ? airportCities.startAirport.lng: fl.lng
      }

      const destLoc:LocationOfInterestRecord = { 
        id: `${fl.id}_dest`,
        mohId: fl.id,
        location: fl.location,
        event: fl.event,
        start: fl.start,
        end: fl.end,
        updated: fl.updated,
        added: fl.added,
        advice: fl.advice,
        exposureType: fl.exposureType,
        visibleInWebform: fl.visibleInWebform,
        city: airportCities ?airportCities.finishAirport.city : fl.city,
        lat: airportCities ?airportCities.finishAirport.lat: fl.lat,
        lng: airportCities ?airportCities.finishAirport.lng: fl.lng
    }

    
    resultantLocations.push(startLoc)
    resultantLocations.push(destLoc);

  }catch(err){
    //if we cant find an airport, just use the original
    resultantLocations.push(fl);
  }

    
  })

  return resultantLocations;
}

const setRelatedLocations = (locations:LocationOfInterestRecord[]) => {
  // I'm a professional developer.
  locations.forEach((l) => {
    l.relatedIds = locations.filter((other) => isRelated(l, other)).map((l) => l.id)
  })
  return locations;
}

const requestLocations = (url:string):Promise<LocationOfInterestRecord[]> => {

    return new Promise<LocationOfInterestRecord[]>((resolve, reject) => {
      try{
        get({url: url})
          .then(async (response:AxiosResponse<LocationOfInterestAPIResponse>) => {
            const res = response.data.items
                .map(mapLoITOLoIRecord)
                .map(reallyBadDataFixes)

                const allRes = createFlightLocations(res);

                const actuallyAllRes = setRelatedLocations(allRes);
            
            resolve(
              actuallyAllRes
            );
          })
            
        }catch(err){
          reject(err);
        }
    })
  }


export  { requestLocations };