import { auth } from "@/auth";
import LoginPage from "@/components/auth/LoginPage";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();

  if (session?.user) {
    redirect("/chat");
  }

  return <LoginPage />;
}
