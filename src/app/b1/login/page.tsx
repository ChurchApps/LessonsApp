import { Suspense } from "react";
import { B1Handoff } from "./B1Handoff";

// The B1 app's Lessons tab frames this page and hands the session over with #jwt. It sits under /b1/ so it
// stays frameable; it never renders the password form, which lives on /login and refuses framing.
export default function B1LoginPage() { return <Suspense><B1Handoff /></Suspense>; }
