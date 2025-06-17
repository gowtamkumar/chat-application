import { auth } from "@/auth";
import HomePage from "@/components/Chat";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const session = await auth();  
  if (!session?.user) {
    redirect("/login");
  }

  return <HomePage />;
}
