import Link from 'next/link'

type  InternalLinkProps = {
    title: string
    href?: string | object | null
    onClick?: any | null
    colorOverrideClass?: string
    linkDisabled?: boolean
}

const InternalLink = ({
    title
    , href = null
    , onClick
    , colorOverrideClass = 'text-green-100 border-green-800 bg-green-500 hover:bg-green-700'
    , linkDisabled = false
}:InternalLinkProps) =>{

    const linkStyle = `text-black pt-2 text-center align-middle border-b-1  border-b-4  w-full h-10 transition-colors duration-150 rounded-lg focus:shadow-outline ${colorOverrideClass}`

    const disabledCheckOnClick = () => { 
        if(!linkDisabled){
            onClick();
        }
    }

    return (
        href != null ? 
        <Link href={href} passHref={true} >
            <div className={linkStyle}>
                {title}
            </div>
        </Link> :
        <div onClick={disabledCheckOnClick} className={`${linkStyle} ${linkDisabled ? 'opacity-30' : ''}`}>
            {title}
        </div>
    )
}

export default InternalLink