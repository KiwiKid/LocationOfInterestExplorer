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

## Prerequisites

Enviroment variables:

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


Tech Debt
Given Covid rather rapid spread, there are some untidy compromises made in the interests of time, such as: 

- A poorly written readme :)
- Merge LargeLocationGrid and LocationGrid components

- [ ] Loose typing (any ftw...)
- [ ] Average Drawer render performance
- [ ] Average Map render performance
     (relating to circle relcalculations. This could become a greater risk Covid progresses and more locations of interest are added)
    - Location circle Clustering?
- [ ] The "LocationOfInterest" type is based on the original CSV item and could be replaced by MohLocationOfInterest). 
- [ ] Zoom button styling (esp when moving drawer)


TODO: document:
  VERCEL_REBUILD_URL
  VERCEL_REBUILD_URL_PREVIEW



Features Ideas (in order of perceived value - 


On the radar:
- Map navigation performance improvements (see refreshVisibleLocations()). Especially with large number of locations.




# Trigger automatic builds:
set VERCEL_REBUILD_URL as a github secret. The "deploy-prod" action will call the Vercel deploy Hook url on "main" and get any new locations each hour.
(VERCEL_REBUILD_URL_PREVIEW) is the alternative for staging enviroments

Open to PR's!