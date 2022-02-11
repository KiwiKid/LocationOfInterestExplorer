// This type is loose to allow for native JSON serilization 
// See https://github.com/vercel/next.js/discussions/13696 for more discussion
type LocationOfInterestRecord = {
    id: string;
    mohId:string
    location: string;
    event: string;
    start: string;
    end: string;
    updated?: string | null;
    added: string;
    advice: string;
    exposureType: string;
    visibleInWebform: boolean;
    city: string;
    lat: number;
    lng: number;
    relatedIds?: string[];
  }