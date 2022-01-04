

export default function LocationExposureTypeDisplay({exposureType, detailed}:any){
    switch(exposureType.toLowerCase()){
        case 'close': return <div className="bg-red-300 text-red-800 p-1 text-center">Close Contact{detailed ? " - Test Immediately - Elevated Level of risk at this location" : null}</div>
        case 'casual': return detailed ? <div className="bg-gray-200 text-gray-600 text-center">Casual Contact</div> : null
        case 'casual plus': return <div className="bg-red-100 text-red-600 p-1 text-center">Casual+ Contact{detailed ? "" : null}</div>
        //case 'approx_multi': return <div className="bg-green-200 text-green-500 p-1 text-center">Flight{detailed ? " - Approximate (destination city) used" : null}</div>
        //default: {
        //    console.error('No location type found for '+exposureType);
        //    return <div className="">Error {exposureType}</div>
      // }
    }
}