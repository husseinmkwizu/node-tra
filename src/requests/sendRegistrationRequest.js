import { sendRequest } from "../helpers/SendRequest.js";
import { createSignature } from "../helpers/cryptoHelper.js";

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

  return sendRequest({
    postData,
    headers,
    hostname,
    path,
    method: "POST",
  });
}
