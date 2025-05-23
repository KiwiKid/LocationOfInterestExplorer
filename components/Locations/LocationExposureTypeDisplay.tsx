
import LocationOfInterest  from '../types/LocationOfInterest'
import OmicronDisplay from './OmicronDisplay'

type LocationExposureTypeDisplay ={
  loi:LocationOfInterest
  hideIfCasual?:boolean
}

function LocationExposureTypeDisplay({loi,hideIfCasual = false}:LocationExposureTypeDisplay){
    switch(loi.exposureType?.toLowerCase()){
        case 'close': return <div className=""><span className="bg-red-300 text-red-800 text-center rounded-xl px-2">Close Contact{loi.isOmicron && <OmicronDisplay/>}</span></div>
        case 'casual plus': return <div><span className="bg-red-100 text-red-600 p-1 text-center rounded-xl ">Casual+ Contact{loi.isOmicron && <OmicronDisplay/>}</span></div>
        default:
        case 'casual': return !hideIfCasual ? <div><span className="bg-gray-200 text-gray-600 text-center rounded-xl">Casual Contact{loi.isOmicron && <OmicronDisplay/>}</span></div>: <div></div>
        //case 'approx_multi': return <div className="bg-green-200 text-green-500 p-1 text-center">Flight{detailed ? " - Approximate (destination city) used" : null}</div>
       /* default: {
            console.error('No location type found for '+exposureType);
            return <div className="">Error {exposureType}</div>
      }*/
    }
}

export default LocationExposureTypeDisplay