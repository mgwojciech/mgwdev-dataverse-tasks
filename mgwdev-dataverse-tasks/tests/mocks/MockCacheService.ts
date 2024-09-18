import { ICacheService } from "mgwdev-m365-helpers";

export class MockCacheService implements ICacheService {
    public inMemoryCache: Map<string, any> = new Map<string, any>();
    constructor() {

    }
    public get<T>(key: string): T {
        return this.inMemoryCache.get(key);
    }
    public set<T>(key: string, value: T): void {
        this.inMemoryCache.set(key, value);
    }
    public remove(key: string): void {
        this.inMemoryCache.delete(key);
    }
}