/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import Header from "@/components/Header";
import SingleChatPage from "@/components/SingleChatPage";
import { getUsers } from "@/utils/api/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Chat() {
  const [selectedChatId, setSelectedChatId] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const route = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const users = await getUsers();
    setUsers(users.data || []);
  };

  // Filter chats based on active tab and search query
  const filteredChats = (users || []).filter((chat: any) => {
    const matchesSearch = chat.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex flex-col  bg-gradient-to-br from-indigo-50 to-white shadow-lg">
      <Header />
      <main className="grid grid-cols-4 overflow-y-auto bg-white">
        <div>
          <div className="p-4 bg-white">
            <input
              type="search"
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:text-gray-600 placeholder-gray-500 shadow-sm transition"
            />
          </div>
          {/* Chat List */}
          {filteredChats.map((chat: any) => {
            return (
              <div
                key={chat.id}
                onClick={() => {
                  setSelectedChatId(chat);
                  // const link = `/chat/${chat.id}`;
                  // route.push(link);
                }}
                className={`flex items-center px-6 py-4 cursor-pointer transition hover:bg-indigo-100`}
              >
                {/* Avatar with online badge */}
                <div className="relative">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/uploads/${chat.file}`}
                    width={100}
                    height={100}
                    alt={chat?.name}
                    className="w-14 h-14 rounded-full object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* {chat.isOnline && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                )} */}
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
          })}
        </div>

        <div className="col-span-3">
          {selectedChatId ? (
            // <div>{selectedChatId.name}</div>
            <SingleChatPage usePrams={selectedChatId} />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f2f5] text-gray-800">
              {/* Illustration */}
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 300 200"
                    fill="none"
                    className="w-full h-full"
                  >
                    <rect
                      x="70"
                      y="50"
                      width="160"
                      height="100"
                      rx="8"
                      fill="#D6F0EE"
                    />
                    <rect
                      x="90"
                      y="70"
                      width="120"
                      height="60"
                      rx="4"
                      fill="white"
                    />
                    <circle cx="200" cy="100" r="10" fill="#25D366" />
                    <rect
                      x="30"
                      y="70"
                      width="50"
                      height="90"
                      rx="10"
                      fill="#E8EDEF"
                    />
                    <rect
                      x="45"
                      y="85"
                      width="20"
                      height="60"
                      rx="4"
                      fill="#B0BEC5"
                    />
                    <rect
                      x="54"
                      y="120"
                      width="3"
                      height="3"
                      rx="1.5"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
              {/* Text Section */}
              <h1 className="text-2xl font-semibold mt-4">Chat hub Web</h1>

              <p className="text-gray-600 text-center mt-2 max-w-md leading-relaxed">
                Send and receive messages without keeping your phone online.
                <br />
                Use Chat hub on up to 4 linked devices and 1 phone at the same
                time.
              </p>

              {/* Footer */}
              <div className="mt-10 flex items-center space-x-2 text-gray-500 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c0 .828-.672 1.5-1.5 1.5S9 11.828 9 11s.672-1.5 1.5-1.5S12 10.172 12 11z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12s4.03-9 9-9 9 4.03 9 9z"
                  />
                </svg>
                <span>Your personal messages are end-to-end encrypted</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
