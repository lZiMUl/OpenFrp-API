import EventEmitter from "events";
import { AxiosInstance, AxiosResponse, create } from "axios";

type init = string | undefined;
type Event = "login" | "error";
type Callback<T = any> = (data: T) => void;

class OpenFrp extends EventEmitter {
    private session: init;
    private authorization: init;
    private cookie: init;
    private readonly LoginAPI: AxiosInstance = create({
        baseURL: "https://openid.17a.ink",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    private readonly BaseAPI: AxiosInstance = create({
        baseURL: "https://of-dev-api.bfsea.xyz",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    public constructor(username: string, password: string) {
        super();
        this.LoginAPI.interceptors.response.use((response: AxiosResponse): AxiosResponse =>
         response.request["path"].includes("login") ? (response.headers["set-cookie"] || [])[0] : response.data.data.code
        );
        this.BaseAPI.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
            this.authorization = response.headers.authorization || this.authorization;
            return response.data.data;
        });
        this["login"](username, password);
    }

    public get getUserInfo(): Promise<object> {
        return new Promise(async (callBack: Callback<object>): Promise<void> => {
            const userInfo: AxiosResponse = await this.BaseAPI({
                url: "/frp/api/getUserInfo",
                headers: {
                    authorization: this.authorization,
                    cookie: this.cookie
                },
                data: {
                    session: this.session
                }
            });
            callBack(userInfo);
        });
    }

    public get sign(): Promise<object> {
        return new Promise(async (callBack: Callback<object>): Promise<void> => {
            const result: AxiosResponse = await this.BaseAPI({
                url: '/frp/api/userSign',
                headers: {
                    authorization: this.authorization,
                    cookie: this.cookie
                },
                data: {
                    session: this.session
                }
            });
            callBack(result);
        });
    }

    public addListener(eventName: Event, listener: () => void): this {
        return super.addListener(eventName, listener);
    }

    private async login(username: string, password: string): Promise<void> {
            try {
                this.cookie = await this.LoginAPI({
                    url: "/api/public/login",
                    data: {
                        user: username,
                        password
                    }
                });
                this.session = await this.BaseAPI({
                    url: "/oauth2/callback",
                    headers: { cookie: this.cookie },
                    params: {
                        code: await this.LoginAPI({
                            url: "/api/oauth2/authorize",
                            headers: { cookie: this.cookie },
                            params: {
                                response_type: "code",
                                redirect_uri: "https://of-dev-api.bfsea.xyz/oauth_callback",
                                client_id: "openfrp"
                            }
                        })
                    }
                });
                super.emit("login");
            } catch (e: Error | any) {
                super.emit("error", e.message);
            }
    }
}

export default OpenFrp;