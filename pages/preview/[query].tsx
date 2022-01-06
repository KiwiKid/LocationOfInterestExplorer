import Image from "next/image"

type PreviewProps = {
  query: string
}

function Preview({query}:PreviewProps):JSX.Element {
    return (<Image src={`/api/image?reqQuery=${query}`} alt={`/api/image?reqQuery=${query}`} width="900" height="600" />)
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