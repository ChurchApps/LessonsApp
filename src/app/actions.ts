"use server";

import { updateTag } from "next/cache";
import { ApiHelper } from "@churchapps/apphelper";
import { EnvironmentHelper } from "@/helpers/EnvironmentHelper";

const ALLOWED_TAGS = ["all"];

// Only lessons.edit callers may flush the public cache; the cheapest lessons.edit-gated GET proves it.
const canEdit = async (jwt: string) => {
  if (!jwt) return false;
  EnvironmentHelper.init();
  const url = ApiHelper.getConfig("LessonsApi")?.url;
  if (!url) return false;
  try {
    const res = await fetch(url + "/programs/provider/none", { headers: { Authorization: "Bearer " + jwt }, cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
};

export async function revalidate(tag: string, jwt: string) {
  if (!ALLOWED_TAGS.includes(tag) || !(await canEdit(jwt))) return false;
  updateTag(tag);
  return true;
}
