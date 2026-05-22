import { assert, assertEquals } from "@std/assert";
import {
  createSession,
  decodeSessionPayload,
  encodeSessionPayload,
  hashPassword,
  parseUsers,
  verifyPassword,
  verifySession,
} from "./auth.ts";

Deno.test("hashPassword / verifyPassword", async () => {
  const stored = await hashPassword("hello-world");
  assert(stored.includes(":"));

  assert(await verifyPassword("hello-world", stored));
  assert(!(await verifyPassword("wrong-password", stored)));
});

Deno.test("hashPassword produces different salts each time", async () => {
  const a = await hashPassword("same-password");
  const b = await hashPassword("same-password");
  assert(a !== b);
});

Deno.test("verifyPassword rejects malformed input", async () => {
  assert(!(await verifyPassword("pwd", "")));
  assert(!(await verifyPassword("pwd", "no-colon-here")));
  assert(!(await verifyPassword("pwd", "only-salt:")));
});

Deno.test("createSession / verifySession", async () => {
  const secret = "test-secret-key";
  const cookie = await createSession("alice", secret);
  assert(cookie.includes("."));

  const result = await verifySession(cookie, secret);
  assertEquals(result, "alice");
});

Deno.test("verifySession rejects wrong secret", async () => {
  const cookie = await createSession("alice", "correct-secret");
  const result = await verifySession(cookie, "wrong-secret");
  assertEquals(result, null);
});

Deno.test("verifySession rejects tampered payload", async () => {
  const cookie = await createSession("bob", "secret");
  const dot = cookie.indexOf(".");
  const tampered = "AAAA" + cookie.slice(dot);
  const result = await verifySession(tampered, "secret");
  assertEquals(result, null);
});

Deno.test("decodeSessionPayload returns data even for expired timestamps", () => {
  const expiredPayload = btoa(
    JSON.stringify({
      username: "alice",
      expires: Math.floor(Date.now() / 1000) - 1,
    }),
  );
  assertEquals(decodeSessionPayload(expiredPayload)?.username, "alice");
});

Deno.test("encodeSessionPayload / decodeSessionPayload roundtrip", () => {
  const payload = encodeSessionPayload("alice");
  const data = decodeSessionPayload(payload);
  assert(data !== null);
  assertEquals(data.username, "alice");
  assert(typeof data.expires === "number");
  assert(data.expires > Math.floor(Date.now() / 1000));
});

Deno.test("decodeSessionPayload rejects invalid input", () => {
  assertEquals(decodeSessionPayload(""), null);
  assertEquals(decodeSessionPayload("!!!!"), null);
  assertEquals(decodeSessionPayload("e30="), null); // "{}" - no username/expires
});

Deno.test("parseUsers", () => {
  const users = parseUsers("alice:salt1:hash1,bob:salt2:hash2");
  assertEquals(users.size, 2);
  assertEquals(users.get("alice"), "salt1:hash1");
  assertEquals(users.get("bob"), "salt2:hash2");
});

Deno.test("parseUsers handles empty string", () => {
  assertEquals(parseUsers("").size, 0);
  assertEquals(parseUsers("   ").size, 0);
});

Deno.test("parseUsers skips malformed entries", () => {
  const users = parseUsers("alice:salt:hash,no-colon,charlie:salt3:hash3");
  assertEquals(users.size, 2);
  assertEquals(users.get("alice"), "salt:hash");
  assertEquals(users.get("charlie"), "salt3:hash3");
});
