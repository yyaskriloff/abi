import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const ACCESS_TOKEN_KEY = "abi.workos.accessToken";
const REFRESH_TOKEN_KEY = "abi.workos.refreshToken";
const CODE_VERIFIER_KEY = "abi.workos.codeVerifier";

export type WorkOsSession = {
  accessToken: string;
  refreshToken: string | null;
};

function base64UrlFromBytes(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlFromBase64(value: string): string {
  return value.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function createPkcePair() {
  const random = await Crypto.getRandomBytesAsync(32);
  const codeVerifier = base64UrlFromBytes(random);
  const challengeBase64 = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier,
    { encoding: Crypto.CryptoEncoding.BASE64 },
  );
  return {
    codeVerifier,
    codeChallenge: base64UrlFromBase64(challengeBase64),
  };
}

async function authenticateWithCode(options: {
  clientId: string;
  code: string;
  codeVerifier: string;
}): Promise<WorkOsSession> {
  const response = await fetch(
    "https://api.workos.com/user_management/authenticate",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: options.clientId,
        grant_type: "authorization_code",
        code: options.code,
        code_verifier: options.codeVerifier,
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`WorkOS authenticate failed: ${response.status} ${body}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? null,
  };
}

async function authenticateWithRefreshToken(options: {
  clientId: string;
  refreshToken: string;
}): Promise<WorkOsSession> {
  const response = await fetch(
    "https://api.workos.com/user_management/authenticate",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: options.clientId,
        grant_type: "refresh_token",
        refresh_token: options.refreshToken,
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`WorkOS refresh failed: ${response.status} ${body}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? options.refreshToken,
  };
}

export async function loadSession(): Promise<WorkOsSession | null> {
  const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  if (!accessToken) return null;
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  return { accessToken, refreshToken };
}

export async function saveSession(session: WorkOsSession): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, session.accessToken);
  if (session.refreshToken) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, session.refreshToken);
  } else {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(CODE_VERIFIER_KEY);
}

export async function signInWithWorkOs(options: {
  clientId: string;
  scheme: string;
}): Promise<WorkOsSession> {
  const redirectUri =
    AuthSession.makeRedirectUri({
      scheme: options.scheme,
      path: "callback",
    }) || `${options.scheme}://callback`;

  const { codeVerifier, codeChallenge } = await createPkcePair();
  await SecureStore.setItemAsync(CODE_VERIFIER_KEY, codeVerifier);

  const authUrl = new URL("https://api.workos.com/user_management/authorize");
  authUrl.searchParams.set("client_id", options.clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("provider", "authkit");
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  const result = await WebBrowser.openAuthSessionAsync(
    authUrl.toString(),
    redirectUri,
  );

  if (result.type !== "success" || !result.url) {
    throw new Error("Sign-in was cancelled");
  }

  const code = new URL(result.url).searchParams.get("code");
  if (!code) {
    throw new Error("WorkOS callback missing authorization code");
  }

  const storedVerifier =
    (await SecureStore.getItemAsync(CODE_VERIFIER_KEY)) ?? codeVerifier;
  const session = await authenticateWithCode({
    clientId: options.clientId,
    code,
    codeVerifier: storedVerifier,
  });

  await SecureStore.deleteItemAsync(CODE_VERIFIER_KEY);
  await saveSession(session);
  return session;
}

export async function getValidAccessToken(options: {
  clientId: string;
}): Promise<string | null> {
  const session = await loadSession();
  if (!session) return null;

  if (!session.refreshToken) {
    return session.accessToken;
  }

  try {
    const refreshed = await authenticateWithRefreshToken({
      clientId: options.clientId,
      refreshToken: session.refreshToken,
    });
    await saveSession(refreshed);
    return refreshed.accessToken;
  } catch {
    return session.accessToken;
  }
}
