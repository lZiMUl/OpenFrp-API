interface UserInfo {
    session: string;
    authorization: string;
    cookie: string;
}
interface LoginInfo extends UserInfo {
    flag: boolean;
    data: string;
    msg: string;
}
declare class OpenFrp {
    private userData?;
    private readonly username;
    private readonly password;
    private authorization?;
    private readonly cookie;
    constructor(username: string, password: string);
    get getUserInfo(): Promise<UserInfo>;
    private get login();
    getRawData<T extends K, K extends keyof T>(key: T): T;
}
export default OpenFrp;
export type { UserInfo, LoginInfo };
//# sourceMappingURL=index.d.ts.map