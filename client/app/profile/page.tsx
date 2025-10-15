import { auth } from "@/auth";
import Profile from "@/components/Profile";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="grid items-center justify-items-center  font-[family-name:var(--font-geist-sans)]">
      <Profile />
    </div>
  );
}
