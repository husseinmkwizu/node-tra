import crypto from "crypto";
import pem from "pem";

export async function createSignature(key, message) {
  const sign = crypto.createSign("RSA-SHA1");
  sign.write(message);
  sign.end();
  const signature = sign.sign(key);
  return signature.toString("base64");
}

export async function loadKeyCertificate(filePath, password) {
  return new Promise((res, rej) => {
    pem.readPkcs12(
      filePath,
      {
        p12Password: password,
      },
      (err, result) => {
        if (err != null) {
          rej(err);
        } else {
          res(result.key);
        }
      }
    );
  });
}
