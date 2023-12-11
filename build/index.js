"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const events_1 = tslib_1.__importDefault(require("events"));
const axios_1 = require("axios");
class OpenFrp extends events_1.default {
    session;
    authorization;
    cookie;
    LoginAPI = (0, axios_1.create)({
        baseURL: "https://openid.17a.ink",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    BaseAPI = (0, axios_1.create)({
        baseURL: "https://of-dev-api.bfsea.xyz",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    constructor(username, password) {
        super();
        this.LoginAPI.interceptors.response.use((response) => response.request["path"].includes("login") ? (response.headers["set-cookie"] || [])[0] : response.data.data.code);
        this.BaseAPI.interceptors.response.use((response) => {
            this.authorization = response.headers.authorization || this.authorization;
            return response.data.data;
        });
        this["login"](username, password);
    }
    get getUserInfo() {
        return new Promise(async (callBack) => {
            const userInfo = await this.BaseAPI({
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
    get sign() {
        return new Promise(async (callBack) => {
            const result = await this.BaseAPI({
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
    addListener(eventName, listener) {
        return super.addListener(eventName, listener);
    }
    async login(username, password) {
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
        }
        catch (e) {
            super.emit("error", e.message);
        }
    }
}
exports.default = OpenFrp;
