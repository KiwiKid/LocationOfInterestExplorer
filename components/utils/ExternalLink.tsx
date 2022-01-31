type ExternalLinkProps = {
    title: string
    href: string
    iconOverride?: string | undefined
    colorClassnameOverride?: string | undefined
}

function ExternalLink({title, href, iconOverride, colorClassnameOverride}:ExternalLinkProps){
    return (
        <div className="m-auto">
            <a target="_blank" 
            rel="noreferrer"
            href={href}>
                <div className={`md:max-w-4xl w-96 bg-black whitespace-nowrap pt-2 text-center ${colorClassnameOverride ? colorClassnameOverride : 'text-blue-100 border-blue-800 bg-blue-600 hover:bg-blue-800'}  align-middle border-b-1  border-b-4  h-10 transition-colors duration-150 rounded-lg focus:shadow-outline`}>
                    {title} {!!iconOverride ? iconOverride : '↗️'}
                </div>
            </a>
        </div>
    )
}

export default ExternalLink