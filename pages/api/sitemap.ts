import { createGzip } from 'zlib'
// @ts-ignore
import { SitemapStream } from 'sitemap'
import { NextApiRequest, NextApiResponse } from 'next'
import { getHardCodedUrl } from '../../components/utils/utils'
import NotionClient from '../../components/Locations/data/NotionClient'



const STATIC_URLS:any = ['?loc=christchurch','?loc=auckland']

const sitemapApi = async (req:NextApiRequest, res:NextApiResponse) => {
  // ensure response is XML & gzip encoded
  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Content-Encoding', 'gzip')

  // makes necessary API calls to get all the dynamic
  // urls from user-gen content
 // const userGenPageUrls = await getUserGeneratedPages()

 const client = new NotionClient();
 const presetLocations = await client.getLocationPresets();

  const sitemapStream = new SitemapStream()
  const pipeline = sitemapStream.pipe(createGzip())

  // write static pages to sitemap
  STATIC_URLS.forEach((url:string) => {
    sitemapStream.write({ url: `${getHardCodedUrl()}${url}` })
  });
  

  presetLocations.forEach((pl:LocationPreset) => {
    sitemapStream.write({ url: `${getHardCodedUrl()}/loc/${pl.urlParam}` })
  });

  presetLocations.forEach((pl:LocationPreset) => {
    sitemapStream.write({ url: `${getHardCodedUrl()}/api/image/loc/${pl.urlParam}` })
  });

  sitemapStream.write({ url: getHardCodedUrl()});

  // write user-generated pages to sitemap
 // userGenPageUrls.forEach((url) => {
 //   sitemapStream.write({ url })
 // })

  sitemapStream.end()

  // stream write the response
  pipeline.pipe(res).on('error', (err:any) => {
    throw err
  })
}

export default sitemapApi