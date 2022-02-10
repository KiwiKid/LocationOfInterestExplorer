class PublishState {
    publishTime: Date
    hardcodedURL: string

    constructor(publishTimeUTCString:string,hardcodedURL){
        this.publishTime = new Date(publishTimeUTCString)
        this.hardcodedURL = hardcodedURL;
    }
}
export default PublishState