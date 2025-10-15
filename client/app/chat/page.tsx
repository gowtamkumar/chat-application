import { auth } from "@/auth";
import Chat from "@/components/Chat";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return <Chat />;
}
