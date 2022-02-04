import Image from 'next/image'

type LoadingProps = {
    locationTitle?:string
}

const Loading = ({locationTitle}:LoadingProps) => {

    return (
        <div style={{ width: '100%', textAlign: 'center' }}>
            <div style={{maxWidth: '400px', margin: 'auto'}}><Image width="400px" src="/img/icon.gif" height="400px" alt="loading icon" /></div>
            <div style={{maxWidth: '600px', margin: 'auto'}}>Loading a map of the latest Covid-19 Locations of Interest {locationTitle ? <>for <span style={{ fontWeight: '600'}}>{locationTitle}</span></>: ''} directly from the Ministry of Health...</div>
        </div>
    )
}

export default Loading;