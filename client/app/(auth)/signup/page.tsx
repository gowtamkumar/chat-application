import { auth } from "@/auth";
import SignupPage from "@/components/SignupPage";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const session = await auth();

  if (session?.user) {
    redirect("/chat");
  }

  return <SignupPage />;
}
