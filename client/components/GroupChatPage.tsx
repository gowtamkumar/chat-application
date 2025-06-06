/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';

type User = {
  id: number;
  name: string;
  avatar: string;
};

type Message = {
  id: number;
  userId: number;
  text: string;
};

export default function GroupChatPage() {
  const users: User[] = [
    { id: 1, name: 'John Doe', avatar: '/user-avatar.png' },
    { id: 2, name: 'Jane Smith', avatar: '/bot-avatar.png' },
    { id: 3, name: 'Alice Johnson', avatar: '/alice-avatar.png' },
  ];

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, userId: 2, text: 'Hi everyone! How can I help you today?' },
    { id: 2, userId: 1, text: 'I have a question about my order.' },
    { id: 3, userId: 3, text: 'Hey all, what’s up?' },
  ]);

  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // For demo, assume current user is user 1
  const currentUserId = 1;

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setInputText((prev) => prev + emojiData.emoji);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        userId: currentUserId,
        text: inputText,
      },
    ]);
    setInputText('');
    setShowEmojiPicker(false);
  };

  const getUser = (id: number) => users.find((u) => u.id === id);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex items-center justify-between border-b">
        {/* Group Avatar or multiple avatars */}
        <div className="flex items-center space-x-3">
          {/* Example: show 3 avatars overlapping */}
          <div className="flex -space-x-2">
            {users.slice(0, 3).map((user) => (
              <img
                key={user.id}
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            ))}
            {/* If more than 3 users, show +N */}
            {users.length > 3 && (
              <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-sm font-semibold text-gray-700">
                +{users.length - 3}
              </div>
            )}
          </div>

          <div>
            <div className="font-semibold text-lg text-gray-700">Group Chat</div>
            <div className="text-sm text-gray-400">{users.length} participants online</div>
          </div>
        </div>

        {/* Call Actions */}
        <div className="flex items-center space-x-4 text-blue-500 text-xl">
          <button title="Group Voice Call" className="hover:text-blue-600">📞</button>
          <button title="Group Video Call" className="hover:text-blue-600">🎥</button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const user = getUser(msg.userId);
          const isCurrentUser = msg.userId === currentUserId;

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 ${isCurrentUser ? 'justify-end' : 'justify-start'
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
                className={`p-3 rounded-xl shadow text-sm max-w-xs break-words ${isCurrentUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700'
                  }`}
              >
                {!isCurrentUser && (
                  <div className="text-xs font-semibold mb-1 text-gray-500">
                    {user?.name}
                  </div>
                )}
                {msg.text}
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

      {/* Message Input */}
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
            onChange={() => {
              /* TODO file upload */
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-500 hover:text-blue-600"
            type="button"
          >
            📎
          </button>

          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-blue-500 hover:text-blue-600"
            type="button"
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
              if (e.key === 'Enter') handleSend();
            }}
          />

          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
            type="button"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
