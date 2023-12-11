"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_console_1 = require("node:console");
const index_1 = tslib_1.__importDefault(require("../build"));
const openFrp = new index_1.default('test@test.com', 'test@test.com');
openFrp.addListener('login', async () => {
    (0, node_console_1.info)(openFrp.getUserInfo);
    (0, node_console_1.info)(openFrp.sign);
});
