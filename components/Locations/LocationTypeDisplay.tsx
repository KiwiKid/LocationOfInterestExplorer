

export default function LocationTypeDisplay({locationType, detailed}:any){
    switch(locationType){
        case 'High': return <div className="bg-red-300 text-red-800 p-1 text-center">High{detailed ? " - Test Immediately - Elevated Level of risk at this location" : null}</div>
        case 'Standard': return null//<div className=" p-2 text-center"></div>
        case 'approx': return <div className="bg-purple-200 text-purple-800 p-1 text-center">Bus High{detailed ? " - Approximate (city) location used " : null}</div>
        case 'approx_multi': return <div className="bg-green-200 text-green-500 p-1 text-center">Flight{detailed ? " - Approximate (destination city) used" : null}</div>
        default: {
            console.error('No location type found for '+locationType);
            return <div className="">Error</div>
        }
    }
}