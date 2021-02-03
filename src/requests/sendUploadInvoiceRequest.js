import { sendRequest } from "../helpers/sendRequest";
import { createSignature } from "../helpers/cryptoHelper";
import convert from "xml-js";

export async function sendUploadInvoiceRequest({
  tin,
  signKey,
  certSerial,
  token,
  routingKey,
  hostname,
  path,

  //-- request specific params
  date, // YYYY-MM-DD
  time, // HH:mm:ss
  regId,
  efdSerial,
  receiptCode, //from registration details
  rctNum,
  zNum,
  dc,
  gc,
  customerId,
  customerIdType,
  customerName,
  mobileNumber,
  items,
  totals,
  payments,
  vatTotals,
}) {
  const itemsXML = getItemsXML(items);
  const totalsXML = getTotalsXML(totals);
  const paymentsXML = getPaymentsXML(payments);
  const vatTotalsXML = getVATTotalsXML(vatTotals);

  const rctData = `<RCT><DATE>${date}</DATE><TIME>${time}</TIME><TIN>${tin}</TIN><REGID>${regId}</REGID><EFDSERIAL>${efdSerial}</EFDSERIAL><CUSTIDTYPE>${customerIdType}</CUSTIDTYPE><CUSTID>${customerId}</CUSTID><CUSTNAME>${customerName}</CUSTNAME><MOBILENUM>${mobileNumber}</MOBILENUM><RCTNUM>${rctNum}</RCTNUM><DC>${dc}</DC><GC>${gc}</GC><ZNUM>${zNum}</ZNUM><RCTVNUM>${receiptCode}${gc}</RCTVNUM>${itemsXML}${totalsXML}${paymentsXML}${vatTotalsXML}</RCT>`;
  const signature = await createSignature(signKey, rctData);

  const postData = `<?xml version="1.0" encoding="UTF-8"?><EFDMS>${rctData}<EFDMSSIGNATURE>${signature}</EFDMSSIGNATURE></EFDMS>`;

  const headers = {
    "Content-Type": "application/xml",
    Authorization: `Bearer ${token}`,
    "Content-Length": postData.length,
    "Cert-Serial": certSerial,
    "Routing-Key": routingKey,
  };

  const response = await sendRequest({
    postData,
    headers,
    hostname,
    path,
    method: "POST",
  });

  if (response == null) {
    return null;
  }
  const { data } = response;

  if (data != null) {
    var options = { compact: true };
    const result = convert.xml2js(data, options);
    const efdResponse = result?.EFDMS?.RCTACK;

    if (efdResponse != null) {
      const resultData = {
        ACKCODE: efdResponse.ACKCODE?._text,
        ACKMSG: efdResponse.ACKMSG?._text,
        RCTNUM: efdResponse.RCTNUM?._text,
        DATE: efdResponse.DATE?._text,
        TIME: efdResponse.TIME?._text,
      };

      return {
        success: efdResponse.ACKCODE?._text == "0",
        data: resultData,
      };
    }
  }

  return null;
}

function getItemsXML(items) {
  let itemsXML = "";
  if (items != null && Array.isArray(items)) {
    items.forEach((obj) => {
      const allKeys = Object.keys(obj);
      let itemXML = "";

      allKeys.forEach((key) => {
        if (obj[key] != null) {
          itemXML += `<${key}>${obj[key]}</${key}>`;
        }
      });

      // append item to items
      if (itemXML !== "") {
        itemsXML += `<ITEM>${itemXML}</ITEM>`;
      }
    });

    // append item to items
    if (itemsXML !== "") {
      itemsXML = `<ITEMS>${itemsXML}</ITEMS>`;
    }
  }

  return itemsXML;
}

function getTotalsXML(totals) {
  let totalsXML = "";

  if (totals != null && typeof totals === "object") {
    const allKeys = Object.keys(totals);
    let tmpXML = "";

    allKeys.forEach((key) => {
      if (totals[key] != null) {
        tmpXML += `<${key}>${totals[key]}</${key}>`;
      }
    });

    // append totals
    if (tmpXML !== "") {
      totalsXML = `<TOTALS>${tmpXML}</TOTALS>`;
    }
  }

  return totalsXML;
}

function getPaymentsXML(payments) {
  let paymentsXML = "";

  if (payments != null && typeof payments === "object") {
    const allKeys = Object.keys(payments);
    let tmpXML = "";

    allKeys.forEach((key) => {
      if (payments[key] != null) {
        tmpXML += `<${key}>${payments[key]}</${key}>`;
      }
    });

    // append payments
    if (tmpXML !== "") {
      paymentsXML = `<PAYMENTS>${tmpXML}</PAYMENTS>`;
    }
  }

  return paymentsXML;
}

function getVATTotalsXML(vatTotals) {
  let vatTotalsXML = "";

  if (vatTotals != null && typeof vatTotals === "object") {
    const allKeys = Object.keys(vatTotals);
    let tmpXML = "";

    allKeys.forEach((key) => {
      if (vatTotals[key] != null) {
        tmpXML += `<${key}>${vatTotals[key]}</${key}>`;
      }
    });

    // append vat totals
    if (tmpXML !== "") {
      vatTotalsXML = `<VATTOTALS>${tmpXML}</VATTOTALS>`;
    }
  }

  return vatTotalsXML;
}
