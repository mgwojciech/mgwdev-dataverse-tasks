import { vi, expect } from 'vitest';
import { PersonaService } from '../../src/services/PersonaService';
import { MockCacheService } from '../mocks/MockCacheService';

export const testUser = {
    displayName: "John Doe",
    id: "123",
    mail: "john.doe@test.com",
    photo: "data:image/png;base64,base64image",
    presence: {
        activity: "Available",
        availability: "Available",
    }
};
describe('PersonaService', () => {
    
    test("should get user (me) from Graph API", async () => {
        const graphClient = {
            get: vi.fn()
        };

        graphClient.get.mockResolvedValueOnce({
            status: 200,
            json: vi.fn().mockResolvedValue({
                id: "123",
                displayName: "John Doe",
                mail: "john.doe@test.com"
            })
        })
            .mockResolvedValueOnce({
                text: vi.fn().mockResolvedValue("base64image")
            })
            .mockResolvedValueOnce({
                json: vi.fn().mockResolvedValue({
                    availability: "Available",
                    activity: "Available"
                })
            });

        const service = new PersonaService(graphClient as any);
        service.storageService = new MockCacheService();
        const persona = await service.getUser();
        expect(persona).toEqual(testUser);
        expect(graphClient.get).toHaveBeenCalledTimes(3);
        expect(graphClient.get).toHaveBeenCalledWith("/me?$select=id,displayName,mail,jobTitle,department,officeLocation,mobilePhone,businessPhones,userPrincipalName,usageLocation");
        expect(graphClient.get).toHaveBeenCalledWith("/me/photos/48x48/$value");
        expect(graphClient.get).toHaveBeenCalledWith("/me/presence");
        const cache: any = service.storageService.get("persona-cache-me");
        expect(cache.data).toEqual(testUser)
    });
    test("should get user (by id) from Graph API", async () => {
        const graphClient = {
            get: vi.fn()
        };

        graphClient.get.mockResolvedValueOnce({
            status: 200,
            json: vi.fn().mockResolvedValue({
                id: "123",
                displayName: "John Doe",
                mail: "john.doe@test.com"
            })
        })
            .mockResolvedValueOnce({
                text: vi.fn().mockResolvedValue("base64image")
            })
            .mockResolvedValueOnce({
                json: vi.fn().mockResolvedValue({
                    availability: "Available",
                    activity: "Available"
                })
            });

        const service = new PersonaService(graphClient as any);
        service.storageService = new MockCacheService();
        const persona = await service.getUser("123");
        expect(persona).toEqual(testUser);
        expect(graphClient.get).toHaveBeenCalledTimes(3);
        expect(graphClient.get).toHaveBeenCalledWith("/users/123?$select=id,displayName,mail,jobTitle,department,officeLocation,mobilePhone,businessPhones,userPrincipalName,usageLocation");
        expect(graphClient.get).toHaveBeenCalledWith("/users/123/photos/48x48/$value");
        expect(graphClient.get).toHaveBeenCalledWith("/users/123/presence");
        const cache: any = service.storageService.get("persona-cache-123");
        expect(cache.data).toEqual(testUser)
    });
    test("should get user (by email) from Graph API", async () => {
        const graphClient = {
            get: vi.fn()
        };

        graphClient.get.mockResolvedValueOnce({
            status: 200,
            json: vi.fn().mockResolvedValue({
                id: "123",
            })
        })
        graphClient.get.mockResolvedValueOnce({
            status: 200,
            json: vi.fn().mockResolvedValue({
                id: "123",
                displayName: "John Doe",
                mail: "john.doe@test.com"
            })
        })
            .mockResolvedValueOnce({
                text: vi.fn().mockResolvedValue("base64image")
            })
            .mockResolvedValueOnce({
                json: vi.fn().mockResolvedValue({
                    availability: "Available",
                    activity: "Available"
                })
            });

        const service = new PersonaService(graphClient as any);
        service.storageService = new MockCacheService();
        const persona = await service.getUser("john.doe@test.com");
        expect(persona).toEqual(testUser);
        expect(graphClient.get).toHaveBeenCalledTimes(4);
        expect(graphClient.get).toHaveBeenCalledWith("/users/john.doe@test.com?$select=id");
        expect(graphClient.get).toHaveBeenCalledWith("/users/123?$select=id,displayName,mail,jobTitle,department,officeLocation,mobilePhone,businessPhones,userPrincipalName,usageLocation");
        expect(graphClient.get).toHaveBeenCalledWith("/users/123/photos/48x48/$value");
        expect(graphClient.get).toHaveBeenCalledWith("/users/123/presence");
        const cache: any = service.storageService.get("persona-cache-123");
        expect(cache.data).toEqual(testUser)
    });
    test("should get user (by id) from cache", async () => {
        const service = new PersonaService({} as any);
        service.storageService = new MockCacheService();
        service.storageService.set("persona-cache-123", {
            data: testUser,
            expiration: new Date().getTime() + 1000 * 60 * 60 * 4
        });
        const persona = await service.getUser("123");
        expect(persona).toEqual(testUser);
    });
    test("should get user (by id) from cache and update presence", async () => {
        const graphClient = {
            get: vi.fn()
        };

        graphClient.get.mockResolvedValueOnce({
            status: 200,
            json: vi.fn().mockResolvedValue({
                availability: "Away",
                activity: "Away"
            })
        });
        const service = new PersonaService(graphClient as any, true);
        service.storageService = new MockCacheService();
        service.storageService.set("persona-cache-123", {
            data: testUser,
            expiration: new Date().getTime() + 1000 * 60 * 60 * 4
        });
        const persona = await service.getUser("123");
        expect(persona).toEqual({ ...testUser, presence: { availability: "Away", activity: "Away" } });
        expect(graphClient.get).toHaveBeenCalledTimes(1);
        expect(graphClient.get).toHaveBeenCalledWith("/users/123/presence");
    });
    test("should get user (me) from cache and update presence", async () => {
        const graphClient = {
            get: vi.fn()
        };

        graphClient.get.mockResolvedValueOnce({
            status: 200,
            json: vi.fn().mockResolvedValue({
                availability: "Away",
                activity: "Away"
            })
        });
        const service = new PersonaService(graphClient as any, true);
        service.storageService = new MockCacheService();
        service.storageService.set("persona-cache-me", {
            data: testUser,
            expiration: new Date().getTime() + 1000 * 60 * 60 * 4
        });
        const persona = await service.getUser();
        expect(persona).toEqual({ ...testUser, presence: { availability: "Away", activity: "Away" } });
        expect(graphClient.get).toHaveBeenCalledTimes(1);
        expect(graphClient.get).toHaveBeenCalledWith("/me/presence");
    });
    test("should return null if user not found", async () => {
        const graphClient = {
            get: vi.fn()
        };

        graphClient.get.mockResolvedValueOnce({
            status: 404
        });
        const service = new PersonaService(graphClient as any);
        service.storageService = new MockCacheService();
        const persona = await service.getUser(testUser.mail);
        expect(persona).toBeNull();
    });
});