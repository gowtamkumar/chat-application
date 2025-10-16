import { auth } from "@/auth";
import Chat from "@/components/chat/Chat";
import { getUsers } from "@/utils/api/user";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const users = await getUsers();

  return <Chat newusers={users.data} />;
}
