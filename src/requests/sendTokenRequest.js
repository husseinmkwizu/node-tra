import { sendRequest } from "../helpers/sendRequest";
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

  if (response == null) {
    return null;
  }
  const { data } = response;

  if (response?.headers?.ackcode != "7") {
    //ACTIVATED
    console.log("DEVICE NOT ACTIVATED");
  }

  if (data != null) {
    const resultData = JSON.parse(data);
    return {
      success: true,
      data: resultData,
    };
  }

  return null;
}
