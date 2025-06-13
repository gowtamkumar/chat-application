/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import socket from "@/utils/socket";

type User = {
  id: number | string;
  name: string;
  avatar: string;
};

type Message = {
  id: number | string;
  userId: number | string;
  text?: string;
  audioUrl?: string;
  imageUrl?: string;
};

export default function SingleChatPage() {
  const users: User[] = [
    {
      id: "472cd74b-f301-41b0-aa8a-91ecf07e7a8a",
      name: "John Doe",
      avatar: "/user-avatar.png",
    },
    {
      id: "d947a179-4061-4a37-a046-afecfda406f1",
      name: "Jane Smith",
      avatar: "/bot-avatar.png",
    },
  ];
    
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 2,
      userId: "472cd74b-f301-41b0-aa8a-91ecf07e7a8a",
      text: "Hello! I’m good, thanks. How about you?",
    },
    {
      id: 3,
      userId: "d947a179-4061-4a37-a046-afecfda406f1",
      text: "Doing great, thanks!",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Camera capture state
  const [cameraOpen, setCameraOpen] = useState(false);
  const cameraStream = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = "d947a179-4061-4a37-a046-afecfda406f1";
  const chatPartner = users.find((u) => u.id !== currentUserId)!;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Start camera stream when camera modal opens
  useEffect(() => {
    if (cameraOpen) {
      (async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          cameraStream.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          alert("Could not access camera.");
          setCameraOpen(false);
          console.error(err);
        }
      })();
    } else {
      // Stop camera when closing modal
      if (cameraStream.current) {
        cameraStream.current.getTracks().forEach((track) => track.stop());
        cameraStream.current = null;
      }
    }
  }, [cameraOpen]);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          userId: msg?.sender?.id,
          text: msg.content,
        },
      ]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (inputText.trim()) {
      console.log("input", inputText);

      socket.emit("chat message", inputText);
      setInputText("");
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setInputText((prev) => prev + emojiData.emoji);
  };

  // Audio recording handlers
  const startRecording = async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert("Audio recording is not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            userId: currentUserId,
            audioUrl,
          },
        ]);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Could not start recording.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    mediaRecorder.current = null;
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startCall = async (type: "audio" | "video") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        type === "video"
          ? { video: true, audio: true }
          : { video: false, audio: true }
      );
      setLocalStream(stream);
      setCallType(type);
    } catch (err) {
      alert("Failed to access media devices.");
      console.error(err);
    }
  };

  const stopCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setLocalStream(null);
    setCallType(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log("Selected file:", files[0]);
    }
  };

  const getUser = (id: number | string) => users.find((u) => u.id === id);

  // Capture photo from webcam
  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL("image/png");
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          userId: currentUserId,
          imageUrl,
        },
      ]);
      setCameraOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-4">
          <img
            src={chatPartner.avatar}
            alt={chatPartner.name}
            className="w-12 h-12 rounded-full border-2 border-blue-500"
          />
          <div>
            <div className="font-semibold text-lg text-gray-700">
              {chatPartner.name}
            </div>
            <div className="text-sm text-gray-400">Online</div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-blue-500 text-xl">
          <button
            title="Start Voice Call"
            className="hover:text-blue-600"
            onClick={() => startCall("audio")}
            type="button"
            aria-label="Start voice call"
          >
            📞
          </button>
          <button
            title="Start Video Call"
            className="hover:text-blue-600"
            onClick={() => startCall("video")}
            type="button"
            aria-label="Start video call"
          >
            🎥
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const user = getUser(msg?.userId);
          console.log("user", user);

          const isCurrentUser = msg.userId === currentUserId;
          console.log("msg", msg);
          console.log("isCurrentUser", isCurrentUser);

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isCurrentUser && (
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
              )}

              <div
                className={`p-3 rounded-xl shadow text-sm max-w-xs break-words ${
                  isCurrentUser
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {!isCurrentUser && (
                  <div className="text-xs font-semibold mb-1 text-gray-500">
                    {user?.name}
                  </div>
                )}
                {msg.text && <p>{msg.text}</p>}
                {msg.audioUrl && (
                  <audio controls className="w-full">
                    <source src={msg.audioUrl} />
                    Your browser does not support the audio element.
                  </audio>
                )}
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Sent photo"
                    className="rounded-md max-w-xs"
                  />
                )}
              </div>

              {isCurrentUser && (
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
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
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-500 hover:text-blue-600"
            type="button"
            aria-label="Attach file"
          >
            📎
          </button>

          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-blue-500 hover:text-blue-600"
            type="button"
            aria-label="Toggle emoji picker"
          >
            😊
          </button>

          {/* Camera button */}
          <button
            onClick={() => setCameraOpen(true)}
            className="text-blue-500 hover:text-blue-600"
            type="button"
            aria-label="Open camera"
          >
            📷
          </button>

          {/* Audio record button */}
          <button
            onClick={toggleRecording}
            className={`${
              isRecording ? "bg-red-600 text-white" : "text-blue-500"
            } hover:text-blue-600 px-2 py-1 rounded`}
            type="button"
            aria-label="Record audio"
          >
            {isRecording ? "■ Recording" : "🎙️"}
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

      {/* Camera Modal */}
      {cameraOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="camera-modal-title"
        >
          <h2
            id="camera-modal-title"
            className="text-2xl font-semibold mb-4 text-white"
          >
            Capture Photo
          </h2>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="rounded-md shadow-lg max-w-full max-h-96"
          />
          <div className="mt-4 space-x-4">
            <button
              onClick={capturePhoto}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
              type="button"
            >
              Capture
            </button>
            <button
              onClick={() => setCameraOpen(false)}
              className="bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-gray-700"
              type="button"
            >
              Cancel
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Call Modal */}
      {callType && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="call-modal-title"
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full flex flex-col items-center space-y-4 relative">
            <h2
              id="call-modal-title"
              className="text-2xl font-semibold mb-2 text-center"
            >
              {callType === "audio" ? "Voice Call" : "Video Call"} with{" "}
              {chatPartner.name}
            </h2>

            {callType === "video" ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-72 h-48 bg-gray-900 rounded-md"
              />
            ) : (
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-blue-500 text-white text-4xl">
                🎙️
              </div>
            )}

            <button
              onClick={stopCall}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
              type="button"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
