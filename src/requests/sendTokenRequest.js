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
    const data = JSON.parse(response);
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
    };
  }

  return null;
}
