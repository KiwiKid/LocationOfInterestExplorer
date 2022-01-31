type ExternalLinkProps = {
    title: string
    href: string
    iconOverride?: string | undefined
    colorClassnameOverride?: string | undefined
    widthClass?:string
}

function ExternalLink({
    title
    , href
    , iconOverride
    , colorClassnameOverride
    , widthClass = 'w-full lg:w-64 xl:w-96'
}:ExternalLinkProps){

    return (
        <div className="m-auto">
            <div className={`${widthClass}`}><a target="_blank" 
            rel="noreferrer"
            href={href}>
                <div className={`whitespace-nowrap pt-2 text-center ${colorClassnameOverride ? colorClassnameOverride : 'text-blue-100 border-blue-800 bg-blue-600 hover:bg-blue-800'}  align-middle border-b-1  border-b-4  h-10 transition-colors duration-150 rounded-lg focus:shadow-outline`}>
                    {title} {!!iconOverride ? iconOverride : '↗️'}
                </div>
            </a>
            </div>
        </div>
    )
}

export default ExternalLink