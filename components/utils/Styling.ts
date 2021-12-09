export function getDaysAgoClassName(hours:number):string{
    return hours < 6 ? "bg-yellow-500" : 
    hours < 12 ? "bg-yellow-400" : 
    hours < 24 ? "bg-yellow-300" : 
    hours < 36 ? "bg-yellow-200" : 
    hours < 48 ? "bg-yellow-100" : ''
}

export function tailwindClassToHex(className: string):string{
    switch(className){
        case "bg-yellow-500": return '#f59e0b'
        case "bg-yellow-400": return '#fbbf24'
        case "bg-yellow-300": return '#fcd34d'
        case "bg-yellow-200": return '#fde68a'
        case "bg-yellow-100": return '#fef3c7'
        default: return ''
    }
}