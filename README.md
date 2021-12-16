# Location of Interest Explorer (nzcovidmap)

The circle based selection method allows for the best in class view of the Covid-19 Locations of Interest (published by the MoH).

Given the time sensitive nature of Covid-19, there are some untidy compromises made in the interests of time. (See "Tech Debt" for more details - open to collaboration here!)

## Prerequisites

Environment variables:
```
MOH_LOCATIONS_URL=https://api.integration.covid19.health.nz/locations/v1/current-locations-of-interest
VERCEL_ENV=development
VERCEL_URL=localhost
```


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


When the app is built, an API call is made to the MOH_LOCATIONS_URL returning and array of locations (MohLocationOfInterest).
These locations are normalised into flat LocationsOfInterests objects.This is mostly for historic reasons (The page was previously built around a CSV export directly from GitHub).
It'd be good to remove the need for that conversion.

When the react-leaflet map loads, we create a set of LocationOfInterestsCalculated within (reloadInCircleLocations()). This and the on-load of the Circle Markers ensures the correct items are highlighted. There is a preference for style updates as it improves the performance of the map re-renders.

The Drawer contains details of all the locations in the current selection circle.
This is really only Mobile-Friendly i could find of allowing the user to explore a large amount of data, while allowing map navigation (who would have guessed, google maps got it right....)


Feature Ideas (open to ideas here!)
- [ ] Ensure latest data is always shown (https://swr.vercel.app/docs/with-nextjs)
- [ ] "Subscribe to a circle" (Notifications) [InProg - GC]
- [ ] Search text filter input box in Drawer
- [ ] Improve navigation between drawers and map (and vice-versa)
- [ ] Its verrry Mobile-First. The Desktop view could use some love
Tech Debt
- [ ] Loose typing (so much "any"...)
  - [ ] The "LocationOfInterest" type is based on the original CSV item and could be replaced by MohLocationOfInterest).
- Merge LargeLocationGrid and LocationGrid components
- [ ] Average Drawer render performance
- [ ] Average Map render performance
     (relating to circle recalculations. This could become a greater risk Covid progresses and more locations of interest are added). 
   - (Update: This has been mitigated through only updating the circle at he end of the drag. Might even need to debounce that update as some users are "peckers", for lack of a better word, when moving the map).
    - Could do Location circle Clustering?
- [ ] Zoom button styling (esp when moving drawer)
- [ ] The useEffects are pretty funky in places (esp around map updates)

Wildcard ideas
- [ ] A guessing game for where new locations of interests will be and providing a leaderboard that will reset weekly.
The goal would be to rise awareness and make understanding Locations of Interests in the community more engaging.
- [ ] A game where you fly a mini plane shooting bullets vaccines at Locations of Interests. Leaderboard for the quickest time to destroy them all.


set the meta tag for verifying domain ownership with google
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_META_TAG 

## Trigger automatic builds:
set VERCEL_REBUILD_URL as a github secret. The "deploy-prod" action will call the Vercel deploy Hook url on "main" and get any new locations each hour.
(VERCEL_REBUILD_URL_PREVIEW) is the alternative for staging environments

Open to PR's!