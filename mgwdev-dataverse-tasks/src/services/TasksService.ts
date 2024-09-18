import { IHttpClient } from "mgwdev-m365-helpers";
import { IUserService } from "./IUserService";
import { IDataverseTask } from "../model/IDataverseTask";

export class TasksService {

    constructor(protected dataverseClient: IHttpClient, protected dataverseResource: string, protected userService: IUserService) {
    }
    public async getMyTasks(): Promise<IDataverseTask[]> {
        const url = `${this.dataverseResource}/api/data/v9.2/tasks?$filter=_ownerid_value eq '${await this.userService.getCurrentUserId()}'&$select=subject,scheduledstart,scheduledend,description,activityid,percentcomplete`;
        const response = await this.dataverseClient.get(url);
        if (response.ok) {
            const data = await response.json();
            return data.value;
        }
        const exception = await response.text();
        throw new Error(exception);
    }
    public async completeTask(task: IDataverseTask): Promise<void> {
        const url = `${this.dataverseResource}/api/data/v9.2/tasks(${task.activityid})`;
        const response = await this.dataverseClient.patch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                percentcomplete: 100
            })
        });
        if (!response.ok) {
            const exception = await response.text();
            throw new Error(exception);
        }
    }
    public async updateTask(task: IDataverseTask): Promise<void> {
        const url = `${this.dataverseResource}/api/data/v9.2/tasks(${task.activityid})`;
        const response = await this.dataverseClient.patch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subject: task.subject,
                description: task.description,
                scheduledstart: task.scheduledstart,
                scheduledend: task.scheduledend,
                percentcomplete: task.percentcomplete
            })
        });
        if (!response.ok) {
            const exception = await response.text();
            throw new Error(exception)
        }
    }
    public async addTask(task: IDataverseTask): Promise<void> {
        const url = `${this.dataverseResource}/api/data/v9.2/tasks`;
        const response = await this.dataverseClient.post(url, {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subject: task.subject,
                description: task.description,
                scheduledstart: task.scheduledstart,
                scheduledend: task.scheduledend,
                percentcomplete: task.percentcomplete
            })
        });
        if (!response.ok) {
            const exception = await response.text();
            throw new Error(exception)
        }
    }
}