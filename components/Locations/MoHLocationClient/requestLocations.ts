import { applyLocationOverrides, mapLoITOLoIRecord } from "../LocationObjectHandling";
import get, { AxiosResponse, AxiosPromise } from 'axios'

const reallyBadDataFixes = (loi:LocationOfInterestRecord) => {
  if(loi.id == 'a0l4a0000006v95AAA' && !loi.city.length){
    loi.city = 'Rotorua'
  }

  if(['a0l4a0000006wceAAA','a0l4a0000006wcjAAA'].some((r) => r === loi.id) && loi.city.length == 0){
    loi.city = 'Auckland'
    loi.lat = '-37.0036884804696'
    loi.lng = '174.78644185846255'
  }

  if(loi.id == 'a0l4a0000006yzUAAQ'){
    loi.city = 'Hamilton'
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
}]

const getCityFromEventRegex = new RegExp(/(\w+) (\-|to) (.+)/g)


const getAirportCities = (loi:LocationOfInterestRecord):FlightCities => {
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
      throw `no two matching airports for ${loi.event}`
    }
}

const isFlight = (loi:LocationOfInterestRecord) => loi.event.startsWith('Flight') && loi.lat === '0' && loi.lng === '0'

const createFlightLocations = (locations:LocationOfInterestRecord[]):LocationOfInterestRecord[] => {
  const resultantLocations = locations.filter((l) => !isFlight(l));
  const flightLocations = locations.filter(isFlight);
  flightLocations.forEach((fl) => {
    try{

      
      const airportCities = getAirportCities(fl);

      const startLoc:LocationOfInterestRecord = { 
          id: `${fl.id}_source`,
          mohId: fl.mohId,
          location: fl.location,
          event: fl.event,
          start: fl.start,
          end: fl.end,
          updated: fl.updated,
          added: fl.added,
          advice: fl.advice,
          exposureType: fl.exposureType,
          visibleInWebform: fl.visibleInWebform,
          city: airportCities.startAirport.city,
          lat: airportCities.startAirport.lat+"", // gross..
          lng: airportCities.startAirport.lng+""
      }

      const destLoc:LocationOfInterestRecord = { 
        id: `${fl.id}_dest`,
        mohId: fl.mohId,
        location: fl.location,
        event: fl.event,
        start: fl.start,
        end: fl.end,
        updated: fl.updated,
        added: fl.added,
        advice: fl.advice,
        exposureType: fl.exposureType,
        visibleInWebform: fl.visibleInWebform,
        city: airportCities.finishAirport.city,
        lat: airportCities.finishAirport.lat+"", // gross..
        lng: airportCities.finishAirport.lng+""
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

const requestLocations = (url:string):Promise<LocationOfInterestRecord[]> => {

    return new Promise<LocationOfInterestRecord[]>((resolve, reject) => {
      try{
        get({url: url})
          .then(async (response:AxiosResponse<LocationOfInterestAPIResponse>) => {
            const res = response.data.items
                .map(mapLoITOLoIRecord)
                .map(reallyBadDataFixes)

                const allRes = createFlightLocations(res);
            
            resolve(
              allRes
            );
          })
            
        }catch(err){
          reject(err);
        }
    })
  }


export  { requestLocations };