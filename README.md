# Location of Interest Explorer (nzcovidmap)

The circle based selection method allows for the best in class view of the Covid-19 Locations of Interest (published by the MoH).

Given the time sensitive nature of Covid-19, there are some untidy compromises made in the interests of time. (See "Tech Debt" for more details - open to collaboration here!)

## Prerequisites

Environment variables:
```
// Current NZ Ministry of Health API endpoint
MOH_LOCATIONS_URL=https://api.integration.covid19.health.nz/locations/v1/current-locations-of-interest
VERCEL_ENV=development
VERCEL_URL=localhost
```
The two "VERCEL" variables ensure we statically render the correct URLs with Vercel. 
Vercel will first build a "commit" specific environments, which will then be "promoted" to production. This results in a url that is correct in the "commit" specific environments, but incorrect when the same build is deployed to the live environments. See getHardCodedUrl() for more details. 
Note: The "commit" specific environments will NOT have the correctly statically render URL - this largely doesn't matter as the URLs are mostly used for SEO/link preview reasons. For this reason, its preferred to use "window.location" when referencing the URL


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
These locations are normalised into flat "LocationsOfInterests" objects.
(This is mostly for historic reasons - the page was previously built around a CSV export directly from GitHub - It'd be nice to remove the need for that conversion.)

When the react-leaflet map loads, we create a set of LocationOfInterestsCalculated within (reloadInCircleLocations()) rendering the locations on the map.

The Drawer contains details of all the locations in the current selection circle.

Feature Ideas (open to ideas here!)
- [ ] "Subscribe to a circle" (Notifications) [InProg - GC]
- [ ] Search text filter input box in Drawer
- [ ] Improve navigation between drawers and map (and vice-versa)
Tech Debt
- [ ] Loose typing (so much "any"...)
  - [ ] The "LocationOfInterest" type is based on the original CSV item and could be replaced by MohLocationOfInterest).
- Merge LargeLocationGrid and LocationGrid components
- [ ] Zoom button styling (esp when moving drawer)
- [ ] The useEffects are pretty funky in places (esp around map updates)

set the meta tag for verifying domain ownership with google (only needed in production)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_META_TAG 



## Production Enviroment variables:
(facebook API ID)
NEXT_PUBLIC_FACEBOOK_APP_ID
(Google forms feedback link)
NEXT_PUBLIC_FEEDBACK_URL=http://google.com
(Google URL verification tag)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_META_TAG=WpxXBycKmD_r57XMCpmtwkVI1hax5LFawIMUZcXzfRo


## Trigger automatic builds:
set VERCEL_REBUILD_URL as a github secret. The "deploy-prod" action will call the Vercel deploy Hook url on "main" and get any new locations each hour.
(VERCEL_REBUILD_URL_PREVIEW) is the alternative for staging environments

Note: Vercel currently allows 100 builds per day. 48 will be used deploying the prod site. If this limit is exceeded, Vercel will pause deployment of the production site.

Open to PR's!