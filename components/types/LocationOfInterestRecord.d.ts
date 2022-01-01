// This type is loose to allow for native JSON serilization 
// See https://github.com/vercel/next.js/discussions/13696 for more discussion
type LocationOfInterestRecord = {
    id: string;
    location: string;
    event: string;
    start: string;
    end: string;
    updated?: string;
    added: string;
    advice: string;
    city: string;
    lat: string;
    lng: string;
    locationType: string;
  }