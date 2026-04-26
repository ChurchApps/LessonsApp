import { APIRequestContext, request } from "@playwright/test";

const MAIN_API = "http://localhost:8084";
const LESSONS_API = "http://localhost:8090";

export type ApiHandle = {
  request: APIRequestContext;
  jwt: string;
  churchId: string;
};

/**
 * Acquire a LessonsApi-scoped JWT for a known seeded user.
 * lessons-admin = curriculum publisher (CHU00000099)
 * grace = Grace Community Church admin (CHU00000001)
 */
export async function getApi(identity: "lessons-admin" | "grace" = "lessons-admin"): Promise<ApiHandle> {
  const ctx = await request.newContext();
  const email = identity === "lessons-admin" ? "lessons-admin@demo.churchapps.org" : "demo@b1.church";
  const churchId = identity === "lessons-admin" ? "CHU00000099" : "CHU00000001";

  const res = await ctx.post(`${MAIN_API}/membership/users/login`, {
    data: { email, password: "password" },
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok()) throw new Error(`login ${identity} failed: ${res.status()}`);
  const body = await res.json();
  const lessonsApi = body.userChurches[0].apis.find((a: any) => a.keyName === "LessonsApi");
  if (!lessonsApi?.jwt) throw new Error("LessonsApi JWT not present in login response");
  return { request: ctx, jwt: lessonsApi.jwt, churchId };
}

export async function lessonsApi(api: ApiHandle, method: "get" | "post" | "delete" | "put", path: string, body?: any) {
  const url = `${LESSONS_API}${path}`;
  const opts: any = {
    headers: { Authorization: `Bearer ${api.jwt}`, "Content-Type": "application/json" },
  };
  if (body !== undefined) opts.data = body;
  const res = await api.request[method](url, opts);
  return res;
}

// 1×1 transparent PNG, used to exercise the image-upload code path without
// shipping a real image asset.
export const TINY_PNG_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";
