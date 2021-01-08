# email-lookup

Best tool online for email checking using Simple Mail Transfer Protocol (SMTP) built in Typescript

[![travis build](https://img.shields.io/travis/devilamre/email-lookup.svg?style=flat-square)](https://travis-ci.org/devilamre/email-lookup)
[![version](https://img.shields.io/npm/v/email-lookup.svg?style=flat-square)](<(http://npm.im/email-lookup)>)
[![downloads](https://img.shields.io/npm/dm/email-lookup.svg?style=flat-square)](https://npm-stat.com/charts.html?package=email-lookups&from=2015-08-01)

## Usage

#### JavaScript

```javascript
const { verifyExistence } = require('email-lookup');

(async () => {
  const response = await verifyexistence('devilamre@gmail.com');
  console.log(response);
})();
```

#### TypeScript

```typescript
import { verifyExistence } from 'email-lookup';

(async () => {
  const response = await verifyexistence('devilamre@gmail.com');
  console.log(response);
})();
```

## Contribute

Contributions welcome!
