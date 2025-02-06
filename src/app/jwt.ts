export const base64urlEncode = (data: string) => {
  return btoa(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const signWithPrivateKey = async (data: string, privateKey: string) => {
  const keyBuffer = await window.crypto.subtle.importKey(
    "pkcs8",
    Uint8Array.from(atob(privateKey.split("\\n").slice(1, -2).join("")), (c) =>
      c.charCodeAt(0)
    ).buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await window.crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    keyBuffer,
    new TextEncoder().encode(data)
  );

  return base64urlEncode(String.fromCharCode(...new Uint8Array(signature)));
};
