/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { getUser } from "@/utils/api/user";
import { Button, Input, Modal } from "antd";
import EmojiPicker from "emoji-picker-react";
import { IoCamera } from "react-icons/io5";

import { useSession } from "next-auth/react";
import Image from "next/image";
// import { useParams } from "next/navigation";
import { getMessages } from "@/utils/api/message";
import { useCallback, useEffect, useRef, useState } from "react";
import AudioCall from "./chat/AudioCall";
import FileUpload from "./chat/FileUpload";
import FileViewer from "./chat/FileViewer";
import CameraRecorder from "./media/CameraCapture";
import VoiceRecorder from "./media/VoiceChat";
import Notification from "./Notification";

export default function SingleChatPage({
  // socket,
  useParams,
  onlineUsers,
  socket,
}: any) {
  const session: any = useSession();

  const [file, setFile] = useState({} as any);
  const [user, setUser] = useState({} as any);
  const [messages, setMessages] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = session.data?.user?.user;

  const getSingleUser = useCallback(async (id: number | string) => {
    try {
      const user = await getUser(id);
      setUser(user.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, []);

  const getMessage = useCallback(async () => {
    const message = await getMessages({
      currentUserId: currentUserId.id,
      useParams: useParams.id as string,
    });
    setMessages(message.data || []);
  }, [currentUserId.id, useParams.id]);

  // ✅ Fetch users once when accessToken is available
  useEffect(() => {
    if (session?.data?.user?.accessToken) {
      getSingleUser(useParams.id as string);
      getMessage();
    }
  }, [
    // getSingleUser,
    session?.data?.user?.accessToken,
    getMessage,
    useParams.id,
  ]);

  // ✅ Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on("single_chat", (msg: any) => {
        setMessages((prev) => [...prev, msg]);
      });

      socket.on("user_offline", () => {
        setNotification(
          "User is offline. Message will be sent when they are back online"
        );
      });
    }
  }, [socket]);

  const sendMessage = async () => {
    if ((inputText.trim() || file.filename) && socket) {
      const messge = {
        content: inputText.trim(),
        senderId: useParams.id,
        file: file.filename,
        filetype: file.mimetype,
      };
      socket.emit("single_chat", messge);

      setMessages((prev) => [
        ...prev,
        { ...messge, senderId: currentUserId.id },
      ]);
      setInputText("");
      setFile({});
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setInputText((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex flex-col h-[90vh] bg-gray-100">
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}

      <header className=" bg-white shadow p-4 justify-between border-b  ">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-2">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/uploads/${user?.file || "user.png"
                }`}
              width={500}
              height={500}
              alt={user?.name || "user"}
              className="w-12 h-12 rounded-full border-2 border-blue-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="font-semibold text-lg text-gray-700">
              {user?.name}
              <h2>
                {" "}
                {onlineUsers.includes(user?.id) ? "🟢 Online" : "Offline"}
              </h2>
            </div>
          </div>

          {socket && (
            <AudioCall socket={socket} targetUserId={useParams.id as string} />
          )}

          {/* {socket && (
            <VideoCall socket={socket} targetUserId={useParams.id as string} />
          )} */}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {(messages || []).map((msg, idx: number) => {
          const isCurrentUser = msg.senderId === currentUserId.id;

          return (
            <div
              key={idx}
              className={`flex items - end ${isCurrentUser ? "justify-end" : "justify-start"
                }`}
            >
              {!isCurrentUser && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/uploads/${user?.file || "user.png"
                    }`}
                  width={500}
                  height={500}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full ml-2 object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
              <div
                className={`text - sm max - w - xs break-words ${isCurrentUser && !msg?.file
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                  } `}
              >
                {msg?.content && (
                  <p className="p-2 rounded-lg">{msg.content}</p>
                )}

                {msg?.file && (
                  <FileViewer
                    file={{
                      pdf: {
                        width: "60%",
                        height: "10vh",
                      },
                      mp4: {
                        width: "100%",
                        height: "10vh",
                      },
                      imgStyle: {
                        width: 100,
                        height: 100,
                        className: "w-60 h-20 object-cover rounded-md",
                      },
                      fileData: {
                        filename: msg?.file,
                        filetype: msg?.filetype,
                      },
                    }}
                  />
                )}
              </div>

              {isCurrentUser && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/uploads/${currentUserId?.file || "user.png"
                    }`}
                  width={500}
                  height={500}
                  alt={currentUserId?.name}
                  className="w-8 h-8 rounded-full ml-2 object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-2 bg-white border-t relative">
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <div>
          {file.filename ? (
            <div className="flex justify-between items-center">
              <FileViewer
                file={{
                  pdf: {
                    width: "40%",
                    height: "10vh",
                  },
                  mp4: {
                    width: "40%",
                    height: "10vh",
                  },
                  imgStyle: {
                    width: 100,
                    height: 100,
                    className: "w-60 h-20 object-cover rounded-md",
                  },
                  fileData: {
                    filename: file.filename,
                    filetype: file.mimetype,
                  },
                }}
              />
              <Button
                onClick={sendMessage}
                className="bg-blue-500  text-white px-4 py-2 rounded-full hover:bg-blue-600"
                aria-label="Send message"
              >
                📤 Send
              </Button>
            </div>
          ) : (
            <div className="flex items-center   space-x-2 p-2 rounded-xl border-2 border-transparent transition focus-within:border-blue-400 focus-within:bg-blue-50">
              <VoiceRecorder setFile={setFile} />
              <Modal
                title="Camera"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
              >
                <CameraRecorder
                  setFile={setFile}
                  setIsModalOpen={setIsModalOpen}
                />
              </Modal>

              <IoCamera
                size={22}
                className="cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              />
              <FileUpload setFile={setFile} fieldname="file" listType="" />
              <Button
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                size="large"
                className="text-blue-500 hover:text-blue-600 cursor-pointer"
                aria-label="Toggle emoji picker"
              >
                😊
              </Button>

              <Input
                type="text"
                size="large"
                placeholder="Type a message or drop a file..."
                className="flex-1 p-2 border rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                aria-label="Message input"
              />

              <Button
                onClick={sendMessage}
                size="large"
                className="bg-blue-500  text-white px-4 py-2 rounded-full hover:bg-blue-600"
                aria-label="Send message"
              >
                📤 Send
              </Button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
