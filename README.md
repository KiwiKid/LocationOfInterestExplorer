# Location of Interest Explorer


## Getting Started

First, run the development server:

```bash
yarn dev
```

The page consists of navigable map with a Drawer at the bottom.
The drawer contains details of the items in the center of the circle.


Note:
Theres some untidy compromises made in the interests of time, such as: 
- Loose typing:
(The "LocationOfInterest" type is based on the original CSV item and could be replaced by MohLocationOfInterest). 
- A poorly written readme :)
- Merge LargeLocationGrid and LocationGrid components


Features Ideas (in order of perceived value - open to ideas here!)
- Improve Drawer render performance
- Search filter input box
- Other date field sort/groupings (Added/Updated)
- Display location age:
  - Use opacity
  - categorization (i.e. 3 day blocks)
- Improve navigation between drawers and map (and vice-versa)

On the radar:
- Map navigation performance improvements (see refreshVisibleLocations()). Especially with large number of locations.

Open to PR's!