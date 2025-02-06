import { base64urlEncode, signWithPrivateKey } from "./jwt";

type ServiceAccount = {
  type: string;
  projectId: string;
  privateKeyId: string;
  privateKey: string;
  clientEmail: string;
  clientId: string;
  authUri: string;
  tokenUri: string;
  authProviderX509CertUrl: string;
  clientX509CertUrl: string;
  universeDomain: string;
};

export const serviceAccount: ServiceAccount = {
  type: process.env.NEXT_PUBLIC_SA_TYPE!,
  projectId: process.env.NEXT_PUBLIC_SA_PROJECT_ID!,
  privateKeyId: process.env.NEXT_PUBLIC_SA_PRIVATE_KEY_ID!,
  privateKey: process.env.NEXT_PUBLIC_SA_PRIVATE_KEY!,
  clientEmail: process.env.NEXT_PUBLIC_SA_CLIENT_EMAIL!,
  clientId: process.env.NEXT_PUBLIC_SA_CLIENT_ID!,
  authUri: process.env.NEXT_PUBLIC_SA_AUTH_URI!,
  tokenUri: process.env.NEXT_PUBLIC_SA_TOKEN_URI!,
  authProviderX509CertUrl:
    process.env.NEXT_PUBLIC_SA_AUTH_PROVIDER_X509_CERT_URI!,
  clientX509CertUrl: process.env.NEXT_PUBLIC_SA_CLIENT_X509_CERT_URL!,
  universeDomain: process.env.NEXT_PUBLIC_SA_UNIVERSE_DOMAIN!,
};

const getJwt = async (serviceAccount: ServiceAccount) => {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "RS256",
    typ: "JWT",
  };
  const payload = {
    iss: serviceAccount.clientEmail,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: serviceAccount.tokenUri,
    exp: now + 3600,
    iat: now,
  };

  const jwtHeader = base64urlEncode(JSON.stringify(header));
  const jwtPayload = base64urlEncode(JSON.stringify(payload));
  const jwtUnsigned = `${jwtHeader}.${jwtPayload}`;
  const jwtSignature = await signWithPrivateKey(
    jwtUnsigned,
    serviceAccount.privateKey
  );
  const jwtToken = `${jwtUnsigned}.${jwtSignature}`;

  return jwtToken;
};

export const getAccessToken = async () => {
  const jwtToken = await getJwt(serviceAccount);

  const response = await fetch(serviceAccount.tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwtToken,
    }),
  });

  const data = await response.json();
  return data.access_token;
};
