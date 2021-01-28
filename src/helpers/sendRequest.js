import https from "https";

export async function sendRequest({
  postData,
  headers,
  method,
  hostname,
  path,
}) {
  postData = postData || "";
  method = method || "GET";
  hostname = hostname || "";
  path = path || "/";
  headers = headers || {};

  const options = {
    hostname,
    port: 443,
    path,
    method,
    headers,
  };

  return new Promise((res, rej) => {
    let data = "";
    const req = https.request(options, (resp) => {
      resp.setEncoding("utf8");
      resp.on("data", (chunk) => {
        data += chunk;
      });
      resp.on("end", () => {
        try {
          res(data);
        } catch (error) {
          rej(error);
        }
      });
    });
    req.on("error", (e) => {
      rej(e);
    });
    req.write(postData);
    req.end();
  });
}
