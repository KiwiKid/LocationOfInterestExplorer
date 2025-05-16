// This type is loose to allow for native JSON serilization 
// See https://github.com/vercel/next.js/discussions/13696 for more discussion
export type LocationOfInterestRecord = {
    id: string;
    mohId:string
    location: string;
    event: string;
    start: string | undefined;
    end: string | undefined;
    updated?: string | undefined;
    added: string;
    advice: string;
    exposureType: string;
    visibleInWebform: boolean;
    city: string;
    lat: number;
    lng: number;
    relatedIds?: string[];
  }