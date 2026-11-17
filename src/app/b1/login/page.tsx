import { Login } from "@/components/Login";

// The B1 app's Lessons tab frames this page and hands the session over with #jwt. It sits under /b1/ so it
// stays frameable; /login keeps refusing framing to protect the password form.
export default function B1LoginPage() { return <Login redirectAfterLogin="/b1/person" />; }
