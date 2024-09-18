export interface IUserService {
    getCurrentUserId(): Promise<string>;
}