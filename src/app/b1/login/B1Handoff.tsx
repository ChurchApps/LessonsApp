"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiHelper, ArrayHelper, UserHelper } from "@churchapps/apphelper";
import { useUser } from "@/app/context/UserContext";

// Paths like "/\evil.com" start with "/" but resolve off-site; keep redirects on this origin.
const sameOriginPath = (url: string) => {
  try {
    const u = new URL(url, window.location.origin);
    return u.origin === window.location.origin ? u.pathname + u.search + u.hash : "/b1/person";
  } catch {
    return "/b1/person";
  }
};

// This route stays frameable for the B1 app, so it never draws the password form. Anything it cannot
// finish with the #jwt goes to /login, which refuses framing.
export function B1Handoff() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const context = useUser();
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !context) return;
    started.current = true;
    const returnUrl = sameOriginPath(searchParams.get("returnUrl") || "/b1/person");
    const churchId = searchParams.get("churchId") || "";

    const toLogin = () => {
      const params = new URLSearchParams({ returnUrl });
      if (churchId) params.set("churchId", churchId);
      window.location.replace("/login?" + params.toString());
    };

    const jwt = new URLSearchParams(window.location.hash.substring(1)).get("jwt") || "";
    if (!jwt || searchParams.get("action") || searchParams.get("auth")) { toLogin(); return; }

    (async () => {
      try {
        const resp = await ApiHelper.postAnonymous("/users/login", { jwt }, "MembershipApi");
        if (!resp?.user || resp.mfaRequired) { toLogin(); return; }
        (resp.userChurches || []).forEach((uc: any) => { if (!uc.apis) uc.apis = []; });
        UserHelper.user = resp.user;
        UserHelper.userChurches = resp.userChurches || [];
        ApiHelper.setDefaultPermissions(resp.user.jwt || "");
        const userChurch = churchId ? ArrayHelper.getOne(UserHelper.userChurches, "church.id", churchId) : UserHelper.userChurches[0];
        if (!userChurch) { toLogin(); return; }
        await UserHelper.selectChurch(context, userChurch.church.id, undefined);

        let person;
        try { person = await ApiHelper.get(`/people/${UserHelper.currentUserChurch.person?.id}`, "MembershipApi"); } catch { person = await ApiHelper.get("/people/claim/" + UserHelper.currentUserChurch.church.id, "MembershipApi"); }
        UserHelper.person = person;
        context.setUser(UserHelper.user);
        context.setUserChurches(UserHelper.userChurches);
        context.setUserChurch(UserHelper.currentUserChurch);
        context.setPerson(person);
        // The rooms pages read the session from context, so stay in this app and replace the history entry.
        router.replace(returnUrl);
      } catch {
        toLogin();
      }
    })();
  }, [context]);

  return <div style={{ padding: 20 }}>Signing in...</div>;
}
