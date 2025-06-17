import { auth } from "@/auth";
import SingleChatPage from "@/components/SingleChatPage";
import { redirect } from "next/navigation";
export default async function page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return (
    <div className="grid items-center justify-items-center  font-[family-name:var(--font-geist-sans)]">
      <SingleChatPage />
    </div>
  );
}
