## node-tra

This package implements TRA (Tanzania Revenue Authority) APIs.

### Install

#### via NPM

```
npm install node-tra --save
```

#### via yarn

```
yarn add node-tra
```

### Load key certificate

Before calling any APIs, you will need to load your key certificate. You can use this helper function to do so.

```javascript
import { loadKeyCertificate } from "node-tra";

const { key } = await loadKeyCertificate(
  "YOUR KEY FILE PATH",
  "YOUR KEY PASSWORD"
);
```

### Registration

To get details about your company you need to call registration API. You call this once. You can reuse the result in the next steps.

```javascript
import { sendRegistrationRequest } from "node-tra";

//test environment details
const hostname = "virtual.tra.go.tz";
const path = "/efdmsRctApi/api/vfdRegReq";

const response = await sendRegistrationRequest({
  tin: "YOUR TIN",
  certKey: "YOUR CERT KEY",
  signKey: key, //key loaded from first step
  certSerial: "YOUR CERT SERIAL",
  hostname: hostname,
  path: path,
});

//if successful, success == true
const { success, data } = response;
```

### Token

To upload receipts/invoices you will need to provide a token to TRA API. To get the token call this helper function.

```javascript
import { sendTokenRequest } from "node-tra";

//test environment details
const hostname = "virtual.tra.go.tz";
const path = "/efdmsRctApi/vfdtoken";

const response = await sendTokenRequest({
  username: "USERNAME FROM REGISTRATION API",
  password: "PASSWORD FROM REGISTRATION API",
  grantType: "password",
  hostname: hostname,
  path: path,
});

//if successful, success == true
const { success, data } = response;
```

### Upload invoice/receipt

```javascript
import { sendUploadInvoiceRequest } from "node-tra";

//test environment details
const hostname = "virtual.tra.go.tz";
const path = "/efdmsRctApi/api/efdmsRctInfo";

const response = await sendUploadInvoiceRequest({
  tin: "YOUR TIN",
  signKey: key, //key loaded from first step
  certSerial: "YOUR CERT SERIAL",
  token: "YOUR TOKEN",
  routingKey: "ROUTING KEY FROM REGISTRATION API",
  hostname: hostname,
  path: path,
  date: "2021-02-03",
  time: "20:52:53",
  regId: "REGID FROM REGISTRATION API",
  efdSerial: "EFDSERIAL FROM REGISTRATION API",
  receiptCode: "RECEIPTCODE FROM REGISTRATION API",
  rctNum: "10103",
  zNum: "20210203",
  dc: "1",
  gc: "10103",
  customerId: "",
  customerIdType: "6",
  customerName: "John Doe",
  mobileNumber: "255755123123",
  items: [
    {
      ID: 1,
      DESC: "Product 1",
      QTY: 1,
      TAXCODE: 1,
      AMT: "118000.00",
    },
  ],
  totals: {
    TOTALTAXEXCL: "100000.00",
    TOTALTAXINCL: "118000.00",
    DISCOUNT: "0.00",
  },
  payments: {
    PMTTYPE: "EMONEY",
    PMTAMOUNT: "118000.00",
  },
  vatTotals: {
    VATRATE: "A",
    NETTAMOUNT: "100000.00",
    TAXAMOUNT: "18000.00",
  },
});

//if successful, success == true
const { success, data } = response;
```
