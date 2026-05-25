import { redirect } from "next/navigation";

/** Root page — redirect to sign-in (auth check will route to dashboard if logged in) */
export default function HomePage() {
  redirect("/sign-in");
}
