import Setting from "@/components/Setting";
import React from "react";

export default function page() {
  return (
     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen  font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] py-10 row-start-2 items-center sm:items-start">
      <Setting />
    </main>
    </div>
  );
}
