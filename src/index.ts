import {error} from 'node:console';
import axios, {AxiosInstance} from 'axios';

const instance: AxiosInstance = axios.create({
    baseURL: 'https://preview.openfrp.net',
    method: 'post',
});

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


type Callback = (data: LoginInfo) => void;
type Refuse = (data: Error) => void;


class OpenFrp {
    private userData?: UserInfo;
    private readonly username: string;
    private readonly password: string;
    private authorization?: string;
    private readonly cookie: string;

    public constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
        this.cookie = `cf_clearance=qwW7jaeY8tIJp7T1FhbEQFoHCmcnUodqSgKyM9pjaAU-1696049038-0-1-c2dc2997.53e30ffb.95dd7677-160.0.0; username=${this.username}; __cf_bm=SbfY7jTcCCkb.C4F76S_4EUYkPNpuFNU_OclSvNHI7E-1696048551-0-AVHDJo06FV6XsT9eI2kXKqkpEXNC7Ai/VvfPeeBebeBitD12BZm98Br48y0b96Zanh7Y5a79dcoIZ5pPowoIoSo=`;
    }

    public get getUserInfo(): Promise<UserInfo> {
        return new Promise(async (callBack: Callback, refuse: Refuse): Promise<UserInfo | void> => {
            try {
                const {flag, data: session, msg: message}: LoginInfo = await this.login;
                if (flag) {
                    const {data}: axios.AxiosResponse<LoginInfo> = await instance({
                        url: '/web/frp/api/getUserInfo',
                        headers: {
                            Authorization: this.authorization,
                            cookie: `${this.cookie}; username=${this.username}; authorization=${this.authorization}; session=${session}`
                        },
                        data: {session}
                    });
                    this.userData = {session, authorization: this.authorization || '', cookie: this.cookie};
                    callBack(data);
                } else {
                    refuse(new Error(message));
                }
            } catch (e: Error | any) {
                throw error(e.message);
            }
        })
    }

    private get login(): Promise<LoginInfo> {
        return new Promise(async (callBack: Callback, refuse: Refuse): Promise<LoginInfo | void> => {
            try {
                const {data, headers}: axios.AxiosResponse<LoginInfo> = await instance({
                    url: '/web/user/login',
                    headers: {
                        Cookie: this.cookie
                    },
                    data: {
                        user: this.username,
                        password: this.password,
                    }
                });
                this.authorization = data.flag ? headers.authorization : null;
                callBack(data);
            } catch (e: Error | any) {
                refuse(e.message);
            }
        })
    }

    public getRawData<T extends K, K extends keyof T>(key: T): T {
        try {
            return this.userData? Reflect.get(this.userData,key): {} as T;
        } catch (e: Error | any) {
            throw error(e.message);
        }


    }
}

export default OpenFrp;
export type {UserInfo, LoginInfo};