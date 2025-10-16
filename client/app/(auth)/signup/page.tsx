import { auth } from "@/auth";
import SignupPage from "@/components/auth/SignupPage";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();

  if (session?.user) {
    redirect("/chat");
  }

  return <SignupPage />;
}
