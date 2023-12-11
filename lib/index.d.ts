/// <reference types="node" />
import EventEmitter from "events";
type Event = "login" | "error";
declare class OpenFrp extends EventEmitter {
    private session;
    private authorization;
    private cookie;
    private readonly LoginAPI;
    private readonly BaseAPI;
    constructor(username: string, password: string);
    get getUserInfo(): Promise<object>;
    get sign(): Promise<object>;
    addListener(eventName: Event, listener: () => void): this;
    private login;
}
export default OpenFrp;
//# sourceMappingURL=index.d.ts.map