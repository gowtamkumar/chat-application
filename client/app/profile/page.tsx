import { auth } from "@/auth";
import Profile from "@/components/profile/Profile";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <Profile />;
}
