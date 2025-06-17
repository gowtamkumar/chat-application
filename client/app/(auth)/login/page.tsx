import { auth } from "@/auth";
import LoginPage from "@/components/LoginPage";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const session = await auth();

  if (session?.user) {
    redirect("/chat");
  }

  return <LoginPage />;
}
