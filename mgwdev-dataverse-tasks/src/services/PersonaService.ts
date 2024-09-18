import { LocalStorageCacheService } from "mgwdev-m365-helpers/lib/services/cache";
import { IHttpClient } from "mgwdev-m365-helpers/lib/dal/http/IHttpClient";
import { ICacheService } from "mgwdev-m365-helpers/lib/services/cache";
import { IUser } from "mgwdev-m365-helpers";
import { ICacheEntry } from "../dal/CacheDataProvider";

export class PersonaService {
    public storageService: ICacheService;
    protected key: string = "persona-cache-";
    public cacheExpiration: number = 1000 * 60 * 60 * 4;
    constructor(protected graphClient: IHttpClient, public updatePresence?: boolean) {
        this.storageService = new LocalStorageCacheService();
    }
    //@queueRequest("getUser-{0}")
    public async getUser(id?: string, size: "48x48" | "64x64" | "96x96" | "120x120" | "240x240" = "48x48") {
        //check if id is an email
        let userId = id;
        if (this.isEmailAddress(id)) {
            const userQuery = `/users/${id}?$select=id`;
            const userRequest = await this.graphClient.get(userQuery);
            if(userRequest.status === 404){
                return null;
            }
            const userResult = await userRequest.json();
            userId = userResult.id;
        }
        let userCache = this.storageService.get<ICacheEntry<IUser>>(this.key + (userId || "me"));
        let user = userCache?.data;
        const userQuery = userId ? `/users/${userId}` : "/me";
        if (this.isCacheInvalid(user, userCache)) {
            const [userInfoRequest, userPhotoRequest, presenceInfo] = await Promise.all(
                [
                    this.graphClient.get(userQuery + "?$select=id,displayName,mail,jobTitle,department,officeLocation,mobilePhone,businessPhones,userPrincipalName,usageLocation"),
                    this.graphClient.get(userQuery + `/photos/${size}/$value`),
                    this.graphClient.get(userQuery + "/presence"),
                ]
            );
            const [userResult, photo, presence] = await Promise.all([
                userInfoRequest.json(),
                userPhotoRequest.text(),
                presenceInfo.json(),
            ]);
            user = {
                ...userResult,
                photo: `data:image/png;base64,${photo.replace('"', "").replace('"', "")}`,
                presence,
            }
            this.storageService.set(this.key +  (userId || "me"), {
                data: user,
                expiration: new Date().getTime() + this.cacheExpiration
            });
        }
        else if (this.updatePresence) {
            const presenceInfo = await this.graphClient.get(userQuery + "/presence");
            const presence = await presenceInfo.json();
            user = {
                ...user,
                presence,
            }
            this.storageService.set(this.key + (userId || "me"), {
                data: user,
                expiration: new Date().getTime() + this.cacheExpiration
            });
        }
        return user;
    }

    private isEmailAddress(id: string) {
        return id && id.indexOf("@") > -1;
    }

    private isCacheInvalid(user: IUser, userCache: ICacheEntry<IUser>) {
        return !user || userCache.expiration < new Date().getTime();
    }
}