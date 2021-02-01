import { sendRequest } from "../helpers/SendRequest.js";
import querystring from "querystring";

export async function sendTokenRequest({
  username,
  password,
  grantType,
  hostname,
  path,
}) {
  const postData = querystring.stringify({
    username: username,
    password: password,
    grant_type: grantType,
  });

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const response = await sendRequest({
    postData,
    headers,
    hostname: hostname,
    path: path,
    method: "POST",
  });

  if (response != null) {
    const resultData = JSON.parse(response);
    return {
      success: true,
      data: resultData,
    };
  }

  return null;
}
