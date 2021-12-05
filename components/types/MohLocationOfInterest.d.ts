type MohLocationOfInterest = {
    eventId: string;
    eventName: string;
    startDateTime: Date;
    endDateTime: Date;
    publicAdvice: string;
    visibleInWebform: boolean;
    updatedAt: Date | null;
    exposureType: string;
    location: MohLocationOfInterestLocation;
}


type MohLocationOfInterestLocation = {
    latitude: string;
    longitude: string;
    suburb: string;
    city: string;
    address: string
    locationType: string;
}