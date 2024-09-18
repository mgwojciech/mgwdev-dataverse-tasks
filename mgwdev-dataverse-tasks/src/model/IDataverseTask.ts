export interface IDataverseTask {
    "@odata.etag"?: string;
    activityid?: string;
    subject: string;
    description:  string;
    scheduledstart:  string;
    scheduledend:  string;
    percentcomplete: number
}
