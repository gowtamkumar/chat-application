import { auth } from "@/auth";
import Setting from "@/components/Setting";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen  font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] py-10 row-start-2 items-center sm:items-start">
        <Setting />
      </main>
    </div>
  );
}
