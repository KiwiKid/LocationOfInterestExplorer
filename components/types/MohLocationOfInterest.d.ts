type MohLocationOfInterest = {
    eventId: string;
    eventName: string;
    startDateTime: string;
    endDateTime: string;
    publicAdvice: string;
    visibleInWebform: boolean;
    publishedAt: string;
    updatedAt?: string | undefined;
    exposureType: string;
    location: MohLocationOfInterestLocation;
}


type MohLocationOfInterestLocation = {
    latitude: number;
    longitude: number;
    suburb: string;
    city: string;
    address: string
    locationType: string;
}