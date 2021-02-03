import { sendRequest } from "../helpers/sendRequest";
import { createSignature } from "../helpers/cryptoHelper";
import convert from "xml-js";

export async function sendRegistrationRequest({
  tin,
  certKey,
  signKey,
  certSerial,
  hostname,
  path,
}) {
  const regData = `<REGDATA><CERTKEY>${certKey}</CERTKEY><TIN>${tin}</TIN></REGDATA>`;
  const signature = await createSignature(signKey, regData);
  const postData = `<EFDMS>${regData}<EFDMSSIGNATURE>${signature}</EFDMSSIGNATURE></EFDMS>`;

  const headers = {
    "Content-Type": "application/xml",
    "Content-Length": postData.length,
    "Cert-Serial": certSerial,
    Client: "webapi",
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
    const efdResponse = result?.EFDMS?.EFDMSRESP;

    if (efdResponse != null) {
      const resultData = {
        ACKCODE: efdResponse.ACKCODE?._text,
        ACKMSG: efdResponse.ACKMSG?._text,
        REGID: efdResponse.REGID?._text,
        SERIAL: efdResponse.SERIAL?._text,
        UIN: efdResponse.UIN?._text,
        TIN: efdResponse.TIN?._text,
        VRN: efdResponse.VRN?._text,
        MOBILE: efdResponse.MOBILE?._text,
        STREET: efdResponse.STREET?._text,
        CITY: efdResponse.CITY?._text,
        COUNTRY: efdResponse.COUNTRY?._text,
        NAME: efdResponse.NAME?._text,
        RECEIPTCODE: efdResponse.RECEIPTCODE?._text,
        REGION: efdResponse.REGION?._text,
        ROUTINGKEY: efdResponse.ROUTINGKEY?._text,
        GC: efdResponse.GC?._text,
        TAXOFFICE: efdResponse.TAXOFFICE?._text,
        USERNAME: efdResponse.USERNAME?._text,
        PASSWORD: efdResponse.PASSWORD?._text,
        TOKENPATH: efdResponse.TOKENPATH?._text,
        // TAXCODES: efdResponse.TAXCODES,
      };

      return {
        success: efdResponse.ACKCODE?._text == "0",
        data: resultData,
      };
    }
  }

  return null;
}
