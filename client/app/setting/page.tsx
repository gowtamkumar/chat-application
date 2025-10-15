import { auth } from "@/auth";
import Setting from "@/components/Setting";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Setting />

  );
}
