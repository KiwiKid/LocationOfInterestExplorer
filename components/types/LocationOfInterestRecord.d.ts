// This type is loose to allow for native JSON serilization 
// See https://github.com/vercel/next.js/discussions/13696 for more discussion
type LocationOfInterestRecord = {
    id: string;
    location: string;
    event: string;
    start: Date;
    end: Date;
    updated: Date;
    added: Date;
    advice: string;
    city: string;
    lat: string;
    lng: string;
    locationType: string;
  }