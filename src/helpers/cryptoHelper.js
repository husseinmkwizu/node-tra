import crypto from "crypto";
import pem from "pem";

export async function createSignature(key, message) {
  const signature = crypto.sign("sha1", Buffer.from(message), {
    key: key,
    padding: crypto.constants.RSA_PKCS1_PADDING,
  });
  return signature.toString("base64");
}

export async function verifySignature(publicKey, message, signature) {
  return crypto.verify(
    "sha1",
    Buffer.from(message),
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    signature
  );
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
          res({ key: result.key });
        }
      }
    );
  });
}
