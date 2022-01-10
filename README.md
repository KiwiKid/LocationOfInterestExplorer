# Location of Interest Explorer (nzcovidmap)

The circle based selection method allows for the best in class view of the Covid-19 Locations of Interest (published by the MoH).

Given the time sensitive nature of Covid-19, there are some untidy compromises made in the interests of time. (See "Tech Debt" for more details - open to collaboration here!)

## Features

- Statically rendered Location specific pages (https://nzcovidmap.org/loc/auckland)
- Install as PWA
- Share bookmarks
- Auto-Locate
- Date filtering
- Quick map navigation links
- Full Mobile/Desktop support

Next up:
- [-] Generate a set of images for major population centers [InProg - GC]
- [ ] Search text filter input box in Drawer
- [ ] Improve navigation between drawers and map (and vice-versa)
- [ ] Extend screenshot API display options



There are two "mode" systems:

QuickLink mode system:

By default the page is running in "specific" mode, as indicated by the circle specific sharing url with parameters like 'lat' and 'lng'. There is just a default sharing preview image and the normal page title.

The other mode is "quickLink". Quicklinks are specific to population centers. When the app is build, a page will be created for each quicklink at '/loc/[urlParam]'. 
The page can enter quicklink mode through either: 
```
/loc/[urlParam] (preferred)
?loc=[urlParam]
```

"/loc/[urlParam]" is perferred as a sharing meta image and page title is provided.

QuickLinks are defined in the "PRESET_LOCATIONS" const:

Adding a new Preset Location:
```
type PresetLocation = {
  title:string // The nice display title
    urlParam:string // The matching url param (via ?loc=[urlParm] or /loc/[urlParm])
    matchingMohCityString:string[] // All MoH locations will be mapped to this location based on these keys
    lat:number 
    lng:number
    zoom:number // The react-leaflet map zoom for this location (compare to other similar sized cities)
}
```

Screenshot mode system:
This allows the app to display a custom appearance when generating a screenshot image. Triggered with the "?sm=preview" query string param.


## Prerequisites

Environment variables:
```
// Current NZ Ministry of Health API endpoint
MOH_LOCATIONS_URL=https://api.integration.covid19.health.nz/locations/v1/current-locations-of-interest
VERCEL_ENV=development
VERCEL_URL=localhost
// Google forms feedback link
NEXT_PUBLIC_FEEDBACK_URL=http://google.com
```
<details>
<summary>"VERCEL_" environment variables</summary>
<p>
The two "VERCEL" variables ensure we statically render the correct URLs with Vercel. 
Vercel will first build a "commit" specific environments, which will then be "promoted" to production. This results in a url that is correct in the "commit" specific environments, but incorrect when the same build is deployed to the live environments. See getHardCodedUrl() for more details. 
Note: The "commit" specific environments will NOT have the correctly statically render URL - this largely doesn't matter as the URLs are mostly used for SEO/link preview reasons. For this reason, its preferred to use "window.location" when referencing the URL
</p>
</details>



## Getting Started

First time?
run:
```bash
yarn install
```

To run the development server:
```bash
yarn dev
```


When the page is built, an API call is made to the MOH_LOCATIONS_URL. The API (published by the NZ Ministry of Health) returns an array of current Covid-19 Locations of Interest "MohLocationOfInterest".
These locations are normalised into flat "LocationOfInterest" objects.
(This is mostly for historic reasons - the page was previously built around a CSV export directly from GitHub - It'd be nice to remove the need for that conversion.)

When the react-leaflet map loads, we create a set of LocationOfInterestsCalculated within (reloadInCircleLocations()) rendering the locations on the map.

The Drawer contains details of all the locations in the current selection circle.


Tech Debt
- [ ] Loose typing (so much "any"...)
  - [ ] The "LocationOfInterest" type is based on the original CSV item and could be replaced by MohLocationOfInterest).
- Merge LargeLocationGrid and LocationGrid components
- [ ] Zoom button styling (esp when moving drawer)
- [ ] The useEffects are pretty funky in places (esp around map updates)





## Production Enviroment variables:
(facebook API ID)
NEXT_PUBLIC_FACEBOOK_APP_ID
(Google forms feedback link)
NEXT_PUBLIC_FEEDBACK_URL=http://google.com
(Google URL verification tag)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_META_TAG=WpxXBycKmD_r57XMCpmtwkVI1hax5LFawIMUZcXzfRo
(meta tag for verifying domain ownership with google)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_META_TAG 


## Trigger automatic builds:
set VERCEL_REBUILD_URL as a github secret. The "deploy-prod" action will call the Vercel deploy Hook url on "main" and get any new locations each hour.
(VERCEL_REBUILD_URL_PREVIEW) is the alternative for staging environments

Note: Vercel currently allows 100 builds per day. 48 will be used deploying the prod site. If this limit is exceeded, Vercel will pause deployment of the production site.

Open to PR's!