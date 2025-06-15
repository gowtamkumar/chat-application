/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const route = useRouter();
  const session: any = useSession();
  const currentUser = {
    name: "Alice Johnson",
    avatar: "/user-avatar.png",
  };

  const chats = [
    {
      id: 1,
      name: "John Doe",
      avatar: "/user-avatar.png",
      lastMessage: "Hey, how are you doing today?",
      lastTime: "10:45 AM",
      unreadCount: 2,
      isOnline: true,
      type: "personal",
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "/bot-avatar.png",
      lastMessage: "Let’s meet tomorrow at 5.",
      lastTime: "9:30 AM",
      unreadCount: 0,
      isOnline: false,
      type: "personal",
    },
    {
      id: 3,
      name: "Family Group",
      avatar: "/group-avatar.png",
      lastMessage: "Anna: I will be late.",
      lastTime: "Yesterday",
      unreadCount: 5,
      isOnline: true,
      type: "group",
    },
    {
      id: 4,
      name: "Work Buddies",
      avatar: "/group-avatar.png",
      lastMessage: "Don’t forget the meeting at 3pm.",
      lastTime: "Mon",
      unreadCount: 0,
      isOnline: false,
      type: "group",
    },
  ];

  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState<"all" | "group">("all");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const getData = await fetch("http://localhost:3900/api/v1/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.data?.user?.token}`,
      },
    });
    const users = await getData.json();
    setUsers(users.data);
  };

  // Filter chats based on active tab and search query
  const filteredChats = (users || []).filter((chat: any) => {
    const matchesTab = activeTab === "all" ? true : chat.type === "group";
    const matchesSearch = chat.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 to-white shadow-lg">
      {/* Header with Profile */}
      <header className="flex items-center justify-between p-5 bg-white shadow-md relative">
        <h1 className="text-3xl font-extrabold text-indigo-700 tracking-wide">
          Chats
        </h1>

        {/* Profile section */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
            aria-label="Toggle profile menu"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="hidden sm:block font-semibold text-indigo-900">
              {currentUser.name}
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
                className="w-full text-left px-4 py-2 text-gray-400 hover:bg-indigo-100"
              >
                Profile
              </button>
              <button
                onClick={() => route.push("setting")}
                className="w-full text-left px-4 py-2 text-gray-400 hover:bg-indigo-100"
              >
                Settings
              </button>
              <button
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex bg-white border-b shadow-sm">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-3 text-center font-semibold transition
            ${activeTab === "all"
              ? "border-b-4 border-indigo-600 text-indigo-700"
              : "text-gray-500 hover:text-indigo-600"
            }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("group")}
          className={`flex-1 py-3 text-center font-semibold transition
            ${activeTab === "group"
              ? "border-b-4 border-indigo-600 text-indigo-700"
              : "text-gray-500 hover:text-indigo-600"
            }`}
        >
          Groups
        </button>
      </nav>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b shadow-sm">
        <input
          type="search"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:text-gray-600 placeholder-gray-500 shadow-sm transition"
        />
      </div>

      {/* Chat List */}
      <main className="flex-1 overflow-y-auto bg-white">
        {filteredChats.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 font-medium">
            No chats found.
          </div>
        ) : (
          filteredChats.map((chat: any) => {
            console.log("chat", chat);

            return (
              <div
                key={chat.id}
                onClick={() => {
                  const link =
                    chat.type === "group"
                      ? `/group-chat/${chat.id}`
                      : `/single-chat/${chat.id}`;
                  route.push(link);
                }}
                className={`flex items-center px-6 py-4 border-b cursor-pointer transition
              ${selectedChatId === chat.id
                    ? "bg-indigo-50 border-indigo-300"
                    : "hover:bg-indigo-100"
                  }`}
              >
                {/* Avatar with online badge */}
                <div className="relative">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {chat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                  )}
                </div>

                {/* Chat info */}
                <div className="flex-1 ml-5 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-lg text-indigo-900 truncate">
                      {chat.name}
                    </h2>
                    <span className="text-xs text-indigo-500 font-semibold whitespace-nowrap">
                      {chat.lastTime}
                    </span>
                  </div>
                  <p className="text-sm text-indigo-700 truncate mt-1">
                    {chat.lastMessage}
                  </p>
                </div>

                {/* Unread count badge */}
                {chat.unreadCount > 0 && (
                  <div className="ml-4 bg-indigo-600 text-white text-xs font-semibold rounded-full px-3 py-1 shadow-md">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
