function b64encode(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf));
}

function b64decode(str: string): Uint8Array | null {
  try {
    return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

async function deriveKey(
  password: string,
): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
}

async function pbkdf2(
  password: string,
  salt: Uint8Array,
): Promise<Uint8Array> {
  const key = await deriveKey(password);
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt.slice(0).buffer as ArrayBuffer,
      iterations: 100_000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt);
  return `${b64encode(salt)}:${b64encode(hash)}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const colon = stored.indexOf(":");
  if (colon === -1) return false;
  const salt = b64decode(stored.slice(0, colon));
  const expected = b64decode(stored.slice(colon + 1));
  if (!salt || !expected) return false;
  const actual = await pbkdf2(password, salt);
  if (actual.length !== expected.length) return false;
  return actual.every((b, i) => b === expected[i]);
}

async function hmacSign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data),
  );
  return b64encode(new Uint8Array(sig));
}

const SESSION_DURATION = 7 * 86400; // 7 days in seconds

export function encodeSessionPayload(username: string): string {
  const expires = Math.floor(Date.now() / 1000) + SESSION_DURATION;
  return b64encode(
    new TextEncoder().encode(JSON.stringify({ username, expires })),
  );
}

export function decodeSessionPayload(
  payload: string,
): { username: string; expires: number } | null {
  try {
    const decoded = b64decode(payload);
    if (!decoded) return null;
    const json = new TextDecoder().decode(decoded);
    const data = JSON.parse(json);
    if (typeof data.username !== "string" || typeof data.expires !== "number") {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export async function createSession(
  username: string,
  secret: string,
): Promise<string> {
  const payload = encodeSessionPayload(username);
  const sig = await hmacSign(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifySession(
  cookie: string,
  secret: string,
): Promise<string | null> {
  const dot = cookie.indexOf(".");
  if (dot === -1) return null;
  const payload = cookie.slice(0, dot);
  const sig = cookie.slice(dot + 1);

  const expected = await hmacSign(secret, payload);
  if (sig.length !== expected.length) return null;
  if (!sig.split("").every((c, i) => c === expected[i])) return null;

  const data = decodeSessionPayload(payload);
  if (!data) return null;
  if (data.expires < Math.floor(Date.now() / 1000)) return null;

  return data.username;
}

export function parseUsers(
  envString: string,
): Map<string, string> {
  const users = new Map<string, string>();
  if (!envString) return users;
  for (const entry of envString.split(",")) {
    const colon = entry.indexOf(":");
    if (colon === -1) continue;
    const username = entry.slice(0, colon);
    const rest = entry.slice(colon + 1);
    users.set(username, rest);
  }
  return users;
}
