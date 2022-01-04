type ExternalLinkProps = {
    title: string
    href: string
    iconOverride?: string | undefined
    colorClassnameOverride?: string | undefined
}

function ExternalLink({title, href, iconOverride, colorClassnameOverride}:ExternalLinkProps){
    return (
        <a target="_blank" 
        rel="noreferrer"
        href={href}>
            <div className={`whitespace-nowrap pt-2 text-center ${colorClassnameOverride ? colorClassnameOverride : 'text-blue-100 border-blue-800 bg-blue-600 hover:bg-blue-800'}  align-middle border-b-1  border-b-4  w-full h-10 transition-colors duration-150 rounded-lg focus:shadow-outline max-w-lg `}>
                {title} {!!iconOverride ? iconOverride : '↗️'}
            </div>
        </a>
    )
}

export default ExternalLink