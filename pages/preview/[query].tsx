import Image from "next/image"

type PreviewProps = {
  query: string
}


//https://c19locations-staging.vercel.app/preview/loc%3Dauckland
//https://c19locations-staging.vercel.app/api/image?reqQuery=loc%3Dauckland&w=1080&q=75

function Preview(props:PreviewProps):JSX.Element {
    const url = `/api/image?reqQuery=${encodeURIComponent(props.query)}`
    return (props.query ? <img src={url} alt={url} width="900" height="600" />: <>No props</>)
  }
  
  export async function getStaticPaths() {
    return {
        paths: [
            { params: { query: encodeURIComponent('loc=auckland')}},
            { params: { query: encodeURIComponent('loc=christchurch')}}
        ],
        fallback: true
    }
  }
  
  // This also gets called at build time
  export async function getStaticProps({params}:any) {
    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
  
    // Pass post data to the page via props
    return { props: { query: params.query } }
  }
  
  export default Preview