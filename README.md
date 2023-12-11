## OpenFrp-API
### A OpenFrp API.

# Install
```text
npm install openfrp-api --save
```

# Usage
```ts
import {info} from 'node:console';
import OpenFrp, {LoginInfo, UserInfo} from 'oaci';

const openFrp: OpenFrp = new OpenFrp('Username', 'Password');
const userInfo: UserInfo = await openFrp.getUserInfo;

const Sign: LoginInfo = await openFrp.Sign;

info(userInfo, Sign);
```