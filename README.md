# Location of Interest Explorer


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

Given Covid's rather rapid spread across NZ, there are some untidy compromises made in the interests of time. (See "Tech Debt" for more details - open to collaboration here!)

## Prerequisites

Environment variables:

MOH_LOCATIONS_URL=https://api.integration.covid19.health.nz/locations/v1/current-locations-of-interest
(the current location of the MoH api)

The page consists of navigable map with a Drawer at the bottom.
The drawer contains details of the items in the center of the circle.

Feature Ideas (open to ideas here!)
- [ ] Search text filter input box in Drawer
- [ ] Display location age:
      - Use opacity?
      - categorization (i.e. 3 day blocks)?
- [ ] Improve navigation between drawers and map (and vice-versa)
- [ ] "Subscribe to a circle" (Notifications)
- [ ]  Other date field sort/groupings in the Drawer
- [ ]  Highlight new locations when a user returns
- [ ]  "Play" button to give a "feel" for Covid spread and be more engaging
- [ ]  Add day.js (or similar) to improve date formatting



- Merge LargeLocationGrid and LocationGrid components
Tech Debt
- [ ] Loose typing ("any" ftw...)
- [ ] Average Drawer render performance
- [ ] Average Map render performance
     (relating to circle recalculations. This could become a greater risk Covid progresses and more locations of interest are added)
    - Location circle Clustering?
- [ ] The "LocationOfInterest" type is based on the original CSV item and could be replaced by MohLocationOfInterest). 
- [ ] Zoom button styling (esp when moving drawer)


On the radar:
- Map navigation performance improvements (see refreshVisibleLocations()). Especially with large number of locations.


set the meta tag for verifying domain ownership with google
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_META_TAG 


# Trigger automatic builds:
set VERCEL_REBUILD_URL as a github secret. The "deploy-prod" action will call the Vercel deploy Hook url on "main" and get any new locations each hour.
(VERCEL_REBUILD_URL_PREVIEW) is the alternative for staging environments

Open to PR's!