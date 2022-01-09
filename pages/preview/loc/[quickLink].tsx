import Image from "next/image"
//import Img from 'react-optimized-image';

type PreviewProps = {
  quickLink: string
}


//https://c19locations-staging.vercel.app/preview/loc%3Dauckland
//https://c19locations-staging.vercel.app/api/image?reqQuery=loc%3Dauckland&w=1080&q=75

function Preview(props:PreviewProps):JSX.Element {
    const url = `/api/image/loc/${encodeURIComponent(props.quickLink)}`;
    return (props.quickLink ? <Image priority={true} src={url} alt={url} quality={10} />: <>No props for image</>)
  }
  
  export async function getStaticPaths() {
    return {
        paths: [
            { params: { quickLink: 'auckland' }},
            { params: { quickLink: 'christchurch' }}
        ],
        fallback: true
    }
  }
  
  // This also gets called at build time
  export async function getStaticProps({params}:any) {
    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
  
    // Pass post data to the page via props
    return { props: { quickLink: params.quickLink } }
  }
  
  export default Preview