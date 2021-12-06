type ExternalLinkProps = {
    title: string
    href: string
}

function ExternalLink({title, href}:ExternalLinkProps){
    return (
        <a target="_blank" 
        rel="noreferrer"
        href={href}>
            <div className="whitespace-nowrap pt-2 text-center text-blue-100 align-middle border-b-1 border-blue-800 border-b-4 bg-blue-600 w-full h-10 transition-colors duration-150 rounded-lg focus:shadow-outline hover:bg-blue-800">
                {title} ↗️
            </div>
        </a>
    )
}

export default ExternalLink