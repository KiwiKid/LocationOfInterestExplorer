type MohLocationOfInterest = {
    eventId: string;
    eventName: string;
    startDateTime: Date;
    endDateTime: Date;
    publicAdvice: string;
    visibleInWebform: boolean;
    publishedAt: Date;
    updatedAt?: Date | undefined;
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