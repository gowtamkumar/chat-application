/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { createSocket } from "@/utils/socket";
import EmojiPicker from "emoji-picker-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Notification from "./Notification";

// type User = {
//   id: number | string;
//   name: string;
//   avatar: string;
// };

// type Message = {
//   id: number | string;
//   userId: number | string;
//   content?: string;
//   audioUrl?: string;
//   imageUrl?: string;
// };

export default function SingleChatPage() {
  const session: any = useSession();
  const usePrams = useParams();
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = session.data?.user?.user?.id;

  const chatPartner = users.find((u) => u.id === usePrams.id);

  // ✅ useCallback to memoize fetch function
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3900/api/v1/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.data?.user?.accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, [session?.data?.user?.accessToken]);

  // ✅ Fetch users once when accessToken is available
  useEffect(() => {
    if (session?.data?.user?.accessToken) {
      fetchData();
    }
  }, [fetchData]);

  // ✅ Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [users]); // or [messages] if this is chat

  useEffect(() => {
    if (session.status === "authenticated") {
      getMessage();
      const newSocket = createSocket(session.data.user.accessToken);
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected:", newSocket.id);
      });
      newSocket.on("single_chat", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      newSocket.on("user_offline", (data) => {
        const user = users.find((u) => u.id === data.userId);
        setNotification(
          `${user?.name || "User"
          } is offline. Message will be sent when they are back online.`
        );
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  const getMessage = async () => {
    const getData = await fetch(
      `http://localhost:3900/api/v1/messagess?senderId=${currentUserId}&receiverId=${usePrams.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.user?.accessToken}`,
        },
      }
    );
    const message = await getData.json();
    setMessages(message.data);
  };

  const sendMessage = async () => {
    if (inputText.trim() && socket) {
      const messge = {
        content: inputText,
        senderId: usePrams.id,
      };
      socket.emit("single_chat", messge);

      setMessages((prev) => [...prev, { ...messge, senderId: currentUserId }]);
      setInputText("");
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setInputText((prev) => prev + emojiData.emoji);
  };

  const getUser = (id: number | string) => users.find((u) => u.id === id);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <header className="bg-white shadow p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-4">
          <img
            src={chatPartner?.image}
            alt={chatPartner?.name}
            className="w-12 h-12 rounded-full border-2 border-blue-500"
          />
          <div>
            <div className="font-semibold text-lg text-gray-700">
              {chatPartner?.name}
            </div>
            <div className="text-sm text-gray-400">Online</div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {(messages || []).map((msg, idx: number) => {
          const user = getUser(msg?.senderId);

          const isCurrentUser = msg.senderId === currentUserId;

          console.log("currentUserId", currentUserId);
          console.log("msg.senderId", msg.senderId);
          // console.log("user", user);
          console.log("msg", isCurrentUser);

          return (
            <div
              key={idx}
              className={`flex items-end ${isCurrentUser ? "justify-end" : "justify-start"
                }`}
            >
              {!isCurrentUser && (
                <img
                  src={user?.image}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div
                className={`p-3 rounded-xl shadow text-sm max-w-xs break-words ${isCurrentUser
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                  }`}
              >
                {!isCurrentUser && (
                  <div className="text-xs font-semibold mb-1 text-gray-500">
                    {user?.name}
                  </div>
                )}
                {msg?.content && <p>{msg.content}</p>}
                {msg?.audioUrl && (
                  <audio controls className="w-full">
                    <source src={msg?.audioUrl} />
                    Your browser does not support the audio element.
                  </audio>
                )}
                {msg?.imageUrl && (
                  <img
                    src={msg?.imageUrl}
                    alt="Sent photo"
                    className="rounded-md max-w-xs"
                  />
                )}
              </div>
              {isCurrentUser && (
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full ml-2"
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-white border-t relative">
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <div className="flex items-center space-x-2 p-2 rounded-xl border-2 border-transparent transition focus-within:border-blue-400 focus-within:bg-blue-50">
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-blue-500 hover:text-blue-600"
            type="button"
            aria-label="Toggle emoji picker"
          >
            😊
          </button>

          <input
            type="text"
            placeholder="Type a message or drop a file..."
            className="flex-1 p-2 border rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            aria-label="Message input"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
            type="button"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
