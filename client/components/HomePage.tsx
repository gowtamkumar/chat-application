/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-2xl text-center flex flex-col gap-[32px] py-10 row-start-2  items-center sm:items-start">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to ChatHub
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          Connect, chat, and collaborate with your team or friends in real-time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition"
          >
            Sign Up
          </button>
          <button
            onClick={() => router.push("/chat")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition"
          >
            Join Chat
          </button>
        </div>

        <div className="mt-8">
          <img
            src="/chat-illustration.png"
            alt="Chat Illustration"
            className="mx-auto w-64 h-auto"
          />
        </div>
      </div>
    </div>
  );
}
