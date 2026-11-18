import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";

const NAME = "tq_admin";
const sig = () => createHash("sha256").update(process.env.ADMIN_TOKEN ?? "").digest("hex");

export async function isAuthed() {
  if (!process.env.ADMIN_TOKEN) return false;
  return (await cookies()).get(NAME)?.value === sig();
}
export async function requireAdmin() {
  if (!(await isAuthed())) redirect("/admin/login");
}
export async function setSession() {
  (await cookies()).set(NAME, sig(), {
    httpOnly: true, sameSite: "lax", path: "/",
    secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7,
  });
}
export async function clearSession() {
  (await cookies()).delete(NAME);
}