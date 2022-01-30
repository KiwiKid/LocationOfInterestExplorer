import Link from 'next/link'
import { Children } from 'react'

type  InternalLinkProps = {
    children: string | JSX.Element
    id: string
    href?: string | object | null
    onClick?: any | null
    linkClassName?: string
    linkDisabled?: boolean
}

const InternalLink = ({
    children
    , id
    , href = null
    , onClick
    , linkClassName = 'text-green-100 border-green-800 bg-green-500 hover:bg-green-700'
    , linkDisabled = false
}:InternalLinkProps) =>{

    const linkStyle = `text-black pt-2 h-10 text-center align-middle border-b-1  border-b-4 w-full min-h-12 transition-colors duration-150 rounded-lg focus:shadow-outline ${linkClassName}`

    const disabledCheckOnClick = (evt:any) => { 
        evt.preventDefault();
        if(!linkDisabled){
            onClick();
        }
    }

    return (
        href != null ? 
        <Link  href={href} passHref={true} >
            <div id={id} className={`${linkStyle} ${linkDisabled ? 'opacity-30' : ''}`}>
                {children}
            </div>
        </Link> :
        <div id={id} onClick={disabledCheckOnClick} className={`${linkStyle} ${linkDisabled ? 'opacity-30' : ''}`}>
            {children}
        </div>
    )
}

export default InternalLink