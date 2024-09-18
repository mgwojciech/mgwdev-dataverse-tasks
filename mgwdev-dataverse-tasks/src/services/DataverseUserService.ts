import { IHttpClient } from "mgwdev-m365-helpers";
import { IUserService } from "./IUserService";

export class DataverseUserService implements IUserService {
    constructor(protected dataverseClient: IHttpClient, protected dataverseResource: string) {

    }
    public async getCurrentUserId(): Promise<string> {
        const url = `${this.dataverseResource}/api/data/v9.2/WhoAmI`;
        const response = await this.dataverseClient.get(url);
        if(response.ok){
            const data = await response.json();
            return data.UserId;
        }
        const exception = await response.text();
        throw new Error(exception);
    }

}