/* eslint-disable @typescript-eslint/no-explicit-any */
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const route = useRouter();
  const session: any = useSession();
  const currentUser = session.data?.user.user;
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  return (
    <header className="flex items-center justify-between p-5 bg-white shadow-md relative">
      <h1 className="text-3xl font-extrabold text-indigo-700 tracking-wide">
        <Link href={'/chat'} >Chats</Link>
      </h1>

      {/* Profile section */}
      <div className="relative">
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
          aria-label="Toggle profile menu"
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/uploads/${currentUser.file || 'user.png'}`}
            width={100}
            height={100}
            alt={currentUser?.name}
            className="w-10 h-10 rounded-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <span className="hidden sm:block font-semibold text-indigo-900">
            {currentUser?.name}
          </span>
          <svg
            className={`w-4 h-4 text-indigo-700 transition-transform ${profileDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown menu */}
        {profileDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
            <button
              onClick={() => route.push("/profile")}
              className="w-full text-left px-4 py-2 text-gray-400 cursor-pointer hover:bg-indigo-100"
            >
              Profile
            </button>
            <button
              onClick={() => route.push("setting")}
              className="w-full text-left px-4 py-2 text-gray-400 cursor-pointer hover:bg-indigo-100"
            >
              Settings
            </button>
            <button
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
