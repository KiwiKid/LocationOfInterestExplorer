import { applyLocationOverrides, isRelated, mapLoITOLoIRecord } from "../LocationObjectHandling";
import get, { AxiosResponse, AxiosPromise } from 'axios'
import LocationOfInterest from "../../types/LocationOfInterest";
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { useContext } from 'react';
import { LocationOfInterestRecord } from "../../types/LocationOfInterestRecord";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

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

const getCityFromEventRegex = new RegExp(/(flight \w+ )(.+)\s*(\-| to )\s*(.+)/gi)


const getAirportCities = (loi:LocationOfInterestRecord):FlightCities|undefined => {
    let startCity:string, finishCity:string

    let result;

    while ((result = getCityFromEventRegex.exec(loi.event)) !== null) {
      //let matchIndex = result.index;
      console.log(`Airport matching: ${loi.event} ${result.toString()}`)
      if(result.length > 3){
          
        startCity = result[result.length-3]
        
      
        finishCity = result[result.length-1]
        
      }else{
        console.error(`Airport Failed to match: ${loi.event} ${result.toString()}`)
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
          startAndEnd: fl.startAndEnd,
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
          lng: airportCities ? airportCities.startAirport.lng: fl.lng,
          raw: fl.raw
      }

      console.log(fl)
      const destLoc:LocationOfInterestRecord = { 
        id: `${fl.id}_dest`,
        mohId: fl.id,
        location: fl.location,
        event: fl.event,
        startAndEnd: fl.startAndEnd,
        start: new Date().toISOString(),//fl.start,
        end: new Date().toISOString(),//fl.end,
        updated: fl.updated,
        added: new Date().toISOString(), //new Date(fl.added).toISOString(),
        advice: fl.advice,
        exposureType: fl.exposureType,
        visibleInWebform: fl.visibleInWebform,
        city: airportCities ?airportCities.finishAirport.city : fl.city,
        lat: airportCities ?airportCities.finishAirport.lat: fl.lat,
        lng: airportCities ?airportCities.finishAirport.lng: fl.lng,
        raw: fl.raw
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
type StartAndEndDateTimes = {
  start: string;
  end?: string;
}

// Helper: Parse date/time from table cell
function parseStartAndEndDateTimes(cellText: string): StartAndEndDateTimes {
  const text = cellText.replace(/\s+/g, ' ').trim();
  // Try to split on ' to ' (with spaces)
  const toMatch = text.match(/^(.*?)(?:\s+to\s+)(.+)$/i);
  if (toMatch) {
    // If the first part looks like a date+time, keep as is; if just time, keep as is
    return { start: toMatch[1], end: toMatch[2] };
  }
  return { start: text, end: undefined };
}

// Helper: Extract city from location cell
function extractCity(locationHtml: string): string {
  const cityMatch = locationHtml.match(/<br>([^<\d]+)(\d{4})?<br?>/i);
  if (cityMatch && cityMatch[1]) {
    return cityMatch[1].replace(/<[^>]+>/g, '').trim();
  }
  const knownCities = ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Dunedin', 'Tauranga', 'Napier', 'Rotorua', 'Palmerston North', 'Nelson', 'New Plymouth', 'Gisborne', 'Invercargill', 'Whangarei'];
  for (const city of knownCities) {
    if (locationHtml.includes(city)) return city;
  }
  return '';
}

function cleanHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Helper to find the closest previous h3 by traversing up the DOM
function findClosestPrevH3($: any, elem: any): string {
  let current = $(elem);
  while (current.length) {
    // Check previous siblings
    let prev = current.prev();
    while (prev.length) {
      if (prev.is('h3')) return prev.text();
      prev = prev.prev();
    }
    // Move up to parent
    current = current.parent();
  }
  return '';
}

const parseStartEndTime = (startDateTimeText: string, lastSeenRowDate:string|undefined): { start: string, end: string | undefined } | undefined => {
  if (!startDateTimeText) return undefined;
  if (startDateTimeText.includes(' to ')) {
    const [startRaw, endRaw] = startDateTimeText.split(' to ');
    // 'Wednesday 7 May 2025 10am'
    const start = dayjs(startRaw.trim(), [
      'YYYY-MM-DDTHH:mm:ssZ',
      'dddd D MMM YYYY h:mma',
      'dddd D MMM YYYY ha',
      'dddd D MMMM YYYY h:mma',
      'dddd D MMMM YYYY ha',
      'D MMM YYYY h:mma',
      'D MMM YYYY ha',
      'D MMMM YYYY h:mma',
      'D MMMM YYYY ha',
      'YYYY-MM-DD',
      'dddd D MMM YYYY',
      'dddd D MMMM YYYY',
      'MMM D, YYYY',
      'MMMM D, YYYY',
      'h:mma',
      'ha',
      'HH:mm',
      'h:mm a',
      'h a',
      'h:mm',
      'h',
    ], true);
    let end;
    // If endRaw is just a time, combine with start's date
    const endTime = dayjs(endRaw.trim(), [
      'h:mma', 'ha', 'HH:mm', 'h:mm a', 'h a', 'h:mm', 'h'
    ], true);
    if (endTime.isValid() && start.isValid()) {
      // Compose end as same date as start, but with end time
      end = start.set('hour', endTime.hour()).set('minute', endTime.minute()).set('second', 0).set('millisecond', 0);
      return {
        start: start.toISOString(),
        end: end.toISOString(),
      };
    } else if (start.isValid() && dayjs(endRaw.trim()).isValid()) {
      end = dayjs(endRaw.trim());
      return {
        start: start.toISOString(),
        end: end.toISOString(),
      };
    } else if (start.isValid()) {
      return {
        start: start.toISOString(),
        end: undefined,
      };
    }
    return undefined;
  } else {
    const single = dayjs(startDateTimeText.trim(), [
      'YYYY-MM-DDTHH:mm:ssZ',
      'dddd D MMM YYYY h:mma',
      'dddd D MMM YYYY ha',
      'dddd D MMMM YYYY h:mma',
      'dddd D MMMM YYYY ha',
      'D MMM YYYY h:mma',
      'D MMM YYYY ha',
      'D MMMM YYYY h:mma',
      'D MMMM YYYY ha',
      'YYYY-MM-DD',
      'dddd D MMM YYYY',
      'dddd D MMMM YYYY',
      'MMM D, YYYY',
      'MMMM D, YYYY',
      'h:mma',
      'ha',
      'HH:mm',
      'h:mm a',
      'h a',
      'h:mm',
      'h',
    ], true);
    if (single.isValid()) return { start: single.toISOString(), end: undefined };
    return undefined;
  }
}

const requestLocationsMeasles = (url: string): Promise<LocationOfInterestRecord[]> => {
  return new Promise<LocationOfInterestRecord[]>(async (resolve, reject) => {
    try {
      console.log('MOH PAGE REQUEST MOH PAGE REQUEST MOH PAGE REQUEST MOH PAGE REQUEST MOH PAGE REQUEST MOH PAGE REQUEST ')
      const response = await get(url, { responseType: 'text' });
      const html = response.data;
      const $ = cheerio.load(html);
      // Log the number of tables in the response
      console.log('Number of tables in response:', $('table').length);
      // Log the number of h3s in the response
      console.log('Number of h3s in response:', $('h3').length);
      const records: LocationOfInterestRecord[] = [];
      // Find all tables where the first th is 'Exposure location'
      $('table').each((tableIdx, tableElem) => {
        const firstTh = $(tableElem).find('th').first().text().trim();
        if (firstTh !== 'Exposure location') return;
        // Use the robust helper to find the closest previous h3
        const headingText = findClosestPrevH3($, tableElem);
        console.log(`Table[${tableIdx}]: Found heading:`, headingText);
        let exposureType: string = '';
        if (headingText.toLowerCase().includes('close contact')) exposureType = 'Close';
        if (headingText.toLowerCase().includes('casual contact')) exposureType = 'Casual';
        if (!exposureType) {
          console.log(`Table[${tableIdx}]: No exposureType found for heading:`, headingText);
          return;
        }
        const rows = $(tableElem).find('tbody tr');
        console.log(`Table[${tableIdx}]: ExposureType=${exposureType}, rows=${rows.length}`);
        var lastSeenRowDate:string|undefined;
        rows.each((rowIdx, row) => {
          const cells = $(row).find('td');
          console.log('CELLS')
          console.log($(cells[1]).html())
          if (cells.length < 2) return;
          const locationHtml = $(cells[0]).html() || '';
          const locationText = cleanHtml(locationHtml);
          const startDateTimeText = cleanHtml($(cells[1]).html() || '');
          let startDateTime:string|undefined;
          let endDateTime:string|undefined;
          if (startDateTimeText){
            try{
              console.log(`Parse startDateTimeText: ${startDateTimeText}`)
                const dateTime = parseStartEndTime(startDateTimeText,lastSeenRowDate );
                if(dateTime){
                  startDateTime = dateTime.start;
                  lastSeenRowDate = dateTime.start;
                }else{
                  console.error(`No startDateTime found for row ${rowIdx}`);
                }

                
              
            }catch(err){
            
              console.error(`Error parsing startDateTime: ${startDateTimeText}`, err);
            }
          }else{
            console.error(`No startDateTimeText found for row ${rowIdx}`);
          }
          const quarantineText = cleanHtml($(cells[2]).html() || '');
          const monitorText = cleanHtml($(cells[3]).html() || '');
          const adviceText = cleanHtml($(cells[4]).html() || '');
          const city = extractCity(locationHtml);
          const id = `measles-${exposureType}-${rowIdx}-${locationText.substring(0, 10).replace(/\s/g, '')}`;
          const record: LocationOfInterestRecord = {
            id,
            mohId: id,
            location: locationText,
            event: locationText,
            startAndEnd: startDateTimeText,
            start: startDateTime ? startDateTime : undefined,
            end: endDateTime ? endDateTime : undefined,
            updated: new Date().toISOString() ,
            added: new Date().toISOString(),
            advice: `${adviceText}  "Quarantine: ${quarantineText}" "Monitor: ${monitorText}"`,
            exposureType,
            visibleInWebform: true,
            city,
            lat: 0,
            lng: 0,
            relatedIds: [],
            raw: $(row).text(),
          };
          records.push(record);
        });
      });
      resolve(records);
    } catch (err) {
      reject(err);
    }
  });
};


export { requestLocationsMeasles, parseStartAndEndDateTimes, parseStartEndTime };