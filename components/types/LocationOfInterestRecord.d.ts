/*{
  "ID": 76,
  "EventID": "",
  "MohID": "",
  "Added": "Wednesday 7 May 2025 10am to 11:45am",
  "Event": "14 May 2025 to the end of 21 May 2025",
  "Location": "Pak n Save, 1167/1177 New North Road, Mount Albert, Auckland 1025",
  "City": "",
  "Start": "2025-05-07T10:00:00",
  "End": "2025-05-07T11:45:00",
  "StartAndEnd": "",
  "Advice": "Quarantine: 14 May 2025 to the end of 21 May 2025; Monitor: Wednesday 28 May; Additional: All people are close contacts",
  "VisibleInWebform": "",
  "ExposureType": "",
  "Lat": 0,
  "Lng": 0,
  "Updated": "",
  "Raw": "Pak n Save\n1167/1177 New North Road\nMount Albert\nAuckland 1025\nWednesday 7 May 2025 10am to 11:45am\n14 May 2025 to the end of 21 May 2025\nWednesday 28 May\nAll people are close contacts"
}*/

export type LocationOfInterestRecord = {
    ID: string;
    MohId:string
    Location: string;
    Event: string;
    StartAndEnd: string | undefined;
    Start: string | undefined;
    End: string | undefined;
    Updated?: string | undefined;
    Added: string;
    Advice: string;
    ExposureType: string;
    VisibleInWebform: boolean;
    City: string;
    Lat: number;
    Lng: number;
    Raw: string | undefined;
  }