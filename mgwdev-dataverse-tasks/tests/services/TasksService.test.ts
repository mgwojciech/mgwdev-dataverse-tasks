import { TasksService } from '../../src/services/TasksService';
import { vi, expect } from 'vitest';

const dataverseResource = "https://contoso.crm.dynamics.com";
const userService = {
    getCurrentUserId: vi.fn().mockResolvedValue("123")
}
describe('TasksService', () => {
    test('should get tasks', async () => {
        const dataverseClient = {
            get: vi.fn()
        };

        dataverseClient.get.mockResolvedValueOnce({
            status: 200,
            ok: true,
            json: vi.fn().mockResolvedValue({
                value: [
                    {
                        activityid: "123",
                        subject: "Task 1",
                        description: "Task 1 description",
                        scheduledstart: "2024-09-01T00:00:00Z",
                        scheduledend: "2024-09-01T00:00:00Z",
                        percentcomplete: 12
                    }
                ]
            })
        });

        const service = new TasksService(dataverseClient as any, dataverseResource, userService);
        const tasks = await service.getMyTasks();
        expect(tasks).toEqual([
            {
                activityid: "123",
                subject: "Task 1",
                description: "Task 1 description",
                scheduledstart: "2024-09-01T00:00:00Z",
                scheduledend: "2024-09-01T00:00:00Z",
                percentcomplete: 12
            }
        ]);
        expect(dataverseClient.get).toHaveBeenCalledTimes(1);
        expect(dataverseClient.get).toHaveBeenCalledWith("https://contoso.crm.dynamics.com/api/data/v9.2/tasks?$filter=_ownerid_value eq '123'&$select=subject,scheduledstart,scheduledend,description,activityid,percentcomplete");
    });
    test("should throw error when getting tasks fails", async () => {
        const dataverseClient = {
            get: vi.fn()
        };

        dataverseClient.get.mockResolvedValueOnce({
            status: 500,
            ok: false,
            text: vi.fn().mockResolvedValue("Error")
        });

        const service = new TasksService(dataverseClient as any, dataverseResource, userService);
        await expect(service.getMyTasks()).rejects.toThrow("Error");
    });
    test("should complete task", async () => {
        const dataverseClient = {
            patch: vi.fn()
        };

        dataverseClient.patch.mockResolvedValueOnce({
            status: 204,
            ok: true
        });

        const service = new TasksService(dataverseClient as any, dataverseResource, userService);
        await service.completeTask({
            activityid: "123",
            subject: "Task 1",
            description: "Task 1 description",
            scheduledstart: "2024-09-01T00:00:00Z",
            scheduledend: "2024-09-01T00:00:00Z",
            percentcomplete: 12
        });
        expect(dataverseClient.patch).toHaveBeenCalledTimes(1);
        expect(dataverseClient.patch).toHaveBeenCalledWith("https://contoso.crm.dynamics.com/api/data/v9.2/tasks(123)", {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                percentcomplete: 100
            })
        });
    });
    test("should throw error when completing task fails", async () => {
        const dataverseClient = {
            patch: vi.fn()
        };

        dataverseClient.patch.mockResolvedValueOnce({
            status: 500,
            ok: false,
            text: vi.fn().mockResolvedValue("Error")
        });

        const service = new TasksService(dataverseClient as any, dataverseResource, userService);
        await expect(service.completeTask({
            activityid: "123",
            subject: "Task 1",
            description: "Task 1 description",
            scheduledstart: "2024-09-01T00:00:00Z",
            scheduledend: "2024-09-01T00:00:00Z",
            percentcomplete: 12
        })).rejects.toThrow("Error");
        expect(dataverseClient.patch).toHaveBeenCalledTimes(1);
        expect(dataverseClient.patch).toHaveBeenCalledWith("https://contoso.crm.dynamics.com/api/data/v9.2/tasks(123)", {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                percentcomplete: 100
            })
        });
    });
    test("should update task", async () => {
        const dataverseClient = {
            patch: vi.fn()
        };

        dataverseClient.patch.mockResolvedValueOnce({
            status: 204,
            ok: true
        });

        const service = new TasksService(dataverseClient as any, dataverseResource, userService);
        await service.updateTask({
            activityid: "123",
            subject: "Task 2",
            description: "Task 1 description",
            scheduledstart: "2024-09-01T00:00:00Z",
            scheduledend: "2024-09-01T00:00:00Z",
            percentcomplete: 12
        });
        expect(dataverseClient.patch).toHaveBeenCalledTimes(1);
        expect(dataverseClient.patch).toHaveBeenCalledWith("https://contoso.crm.dynamics.com/api/data/v9.2/tasks(123)", {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subject: "Task 2",
                description: "Task 1 description",
                scheduledstart: "2024-09-01T00:00:00Z",
                scheduledend: "2024-09-01T00:00:00Z",
                percentcomplete: 12
            })
        });
    });
    test("should throw error when updating task fails", async () => {
        const dataverseClient = {
            patch: vi.fn()
        };

        dataverseClient.patch.mockResolvedValueOnce({
            status: 500,
            ok: false,
            text: vi.fn().mockResolvedValue("Error")
        });

        const service = new TasksService(dataverseClient as any, dataverseResource, userService);
        await expect(service.updateTask({
            activityid: "123",
            subject: "Task 2",
            description: "Task 1 description",
            scheduledstart: "2024-09-01T00:00:00Z",
            scheduledend: "2024-09-01T00:00:00Z",
            percentcomplete: 12
        })).rejects.toThrow("Error");
        expect(dataverseClient.patch).toHaveBeenCalledTimes(1);
        expect(dataverseClient.patch).toHaveBeenCalledWith("https://contoso.crm.dynamics.com/api/data/v9.2/tasks(123)", {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subject: "Task 2",
                description: "Task 1 description",
                scheduledstart: "2024-09-01T00:00:00Z",
                scheduledend: "2024-09-01T00:00:00Z",
                percentcomplete: 12
            })
        });
    });
    test("should add task", async () => {
        const dataverseClient = {
            post: vi.fn()
        };

        dataverseClient.post.mockResolvedValueOnce({
            status: 204,
            ok: true
        });

        const service = new TasksService(dataverseClient as any, dataverseResource, userService);
        await service.addTask({
            activityid: "123",
            subject: "Task 2",
            description: "Task 1 description",
            scheduledstart: "2024-09-01T00:00:00Z",
            scheduledend: "2024-09-01T00:00:00Z",
            percentcomplete: 12
        });
        expect(dataverseClient.post).toHaveBeenCalledTimes(1);
        expect(dataverseClient.post).toHaveBeenCalledWith("https://contoso.crm.dynamics.com/api/data/v9.2/tasks", {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subject: "Task 2",
                description: "Task 1 description",
                scheduledstart: "2024-09-01T00:00:00Z",
                scheduledend: "2024-09-01T00:00:00Z",
                percentcomplete: 12
            })
        });
    });
    test("should throw error when adding task fails", async () => {
        const dataverseClient = {
            post: vi.fn()
        };

        dataverseClient.post.mockResolvedValueOnce({
            status: 500,
            ok: false,
            text: vi.fn().mockResolvedValue("Error")
        });

        const service = new TasksService(dataverseClient as any, dataverseResource, userService);
        await expect(service.addTask({
            activityid: "123",
            subject: "Task 2",
            description: "Task 1 description",
            scheduledstart: "2024-09-01T00:00:00Z",
            scheduledend: "2024-09-01T00:00:00Z",
            percentcomplete: 12
        })).rejects.toThrow("Error");
        expect(dataverseClient.post).toHaveBeenCalledTimes(1);
        expect(dataverseClient.post).toHaveBeenCalledWith("https://contoso.crm.dynamics.com/api/data/v9.2/tasks", {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subject: "Task 2",
                description: "Task 1 description",
                scheduledstart: "2024-09-01T00:00:00Z",
                scheduledend: "2024-09-01T00:00:00Z",
                percentcomplete: 12
            })
        });
    });
});