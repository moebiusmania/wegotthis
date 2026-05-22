import { hashPassword } from "../lib/auth.ts";

let username: string;
let password: string;

if (Deno.args.length >= 2) {
  username = Deno.args[0];
  password = Deno.args[1];
} else {
  username = prompt("Username:")?.trim() || "";
  password = prompt("Password:")?.trim() || "";
}

if (!username || !password) {
  console.error("Usage: deno task hashpwd <username> <password>");
  Deno.exit(1);
}

const stored = await hashPassword(password);
console.log(`\nAdd this to your .env USERS variable:\n${username}:${stored}\n`);
