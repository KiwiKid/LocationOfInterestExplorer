import Image from "next/image"

function Preview(query:string) {
    return (<Image src={`/api/image${query}`} alt="NZ Locations of interest"/>)
  }
  
  export async function getStaticPaths() {
    return {
        paths: [
            { params: { loc: 'auckland'}},
            { params: { loc: 'christchurch'}}
        ]
    }
  }
  
  // This also gets called at build time
  /*export async function getStaticProps({ params }) {
    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
    const res = await fetch(`/${params.reqQuery}`)
    const post = await res.json()
  
    // Pass post data to the page via props
    return { props: { post } }
  }*/
  
  export default Preview