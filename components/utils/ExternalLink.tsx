type ExternalLinkProps = {
    title: string
    href: string
    iconOverride?: string | undefined
    colorClassnameOverride?: string | undefined
    widthClass?:string
    height?:number
}

function ExternalLink({
    title
    , href
    , iconOverride
    , colorClassnameOverride
    , widthClass = 'md:w-64 lg:w-64 xl:w-96'
    , height = 10
}:ExternalLinkProps){

    return (
        <div className="">
            <div className={`m-auto ${widthClass}`}><a target="_blank" 
            rel="noreferrer"
            href={href}>
                <div className={`whitespace-nowrap pt-${height > 9 ? 2 : 1} text-center ${colorClassnameOverride ? colorClassnameOverride : 'text-blue-100 border-blue-800 bg-blue-600 hover:bg-blue-800'}  ${height > 9 ? 'text-lg': 'text-md'} align-middle border-b-4  h-${height} transition-colors duration-150 rounded-lg focus:shadow-outline`}>
                    {title} {!!iconOverride ? iconOverride : '↗️'}
                </div>
            </a>
            </div>
        </div>
    )
}

export default ExternalLink