import { DataverseUserService } from '../../src/services/DataverseUserService';
import { vi, expect } from 'vitest';
describe('DataverseUserService', () => {
    test("should get current user", async () => {
        const dataverseClient = {
            get: vi.fn().mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue({ UserId: "123" })
            })
        };
        const dataverseResource = "https://contoso.crm.dynamics.com";
        const service = new DataverseUserService(dataverseClient as any, dataverseResource);
        const userId = await service.getCurrentUserId();
        expect(userId).toBe("123");
        expect(dataverseClient.get).toHaveBeenCalledWith("https://contoso.crm.dynamics.com/api/data/v9.2/WhoAmI");
    });
    test("should throw error when request fails", async () => {
        const dataverseClient = {
            get: vi.fn().mockResolvedValue({
                ok: false,
                text: vi.fn().mockResolvedValue("Not authorized")
            })
        };
        const dataverseResource = "https://contoso.crm.dynamics.com";
        const service = new DataverseUserService(dataverseClient as any, dataverseResource);
        try {
            await service.getCurrentUserId();
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Not authorized");
        }
    });
});