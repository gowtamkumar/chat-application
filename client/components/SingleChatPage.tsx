/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';

export default function SingleChatPage() {
  const initialUsers = [
    { id: 1, name: 'John Doe', avatar: '/user-avatar.png' },
    { id: 2, name: 'Jane Smith', avatar: '/bot-avatar.png' },
  ];

  const [users] = useState(initialUsers);
  const [selectedUserId, setSelectedUserId] = useState<number>(initialUsers[0].id);
  const [isDragging, setIsDragging] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Store messages with reactions
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hi there! How can I help you today?',
      type: 'incoming' as const,
      reactions: {} as Record<string, number>,
    },
    {
      id: 2,
      text: 'I have a question about my order.',
      type: 'outgoing' as const,
      reactions: {} as Record<string, number>,
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setInputText((prev) => prev + emojiData.emoji);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      console.log('Dropped files:', files);
      // TODO: handle upload
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      console.log('Selected file:', files[0]);
      // TODO: handle upload
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      type: 'outgoing' as const,
      reactions: {},
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setShowEmojiPicker(false);
  };

  // Toggle reaction emoji on a message
  const toggleReaction = (messageId: number, emoji: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.id === messageId) {
          const currentCount = msg.reactions[emoji] ?? 0;
          const newReactions = { ...msg.reactions };

          if (currentCount > 0) {
            // Remove reaction
            delete newReactions[emoji];
          } else {
            // Add reaction with count 1 (could be extended to multi-user counts)
            newReactions[emoji] = 1;
          }

          return { ...msg, reactions: newReactions };
        }
        return msg;
      })
    );
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex items-center justify-between border-b">
        {selectedUser ? (
          <>
            <div className="flex items-center space-x-3">
              <img src={selectedUser.avatar} className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-semibold text-lg text-gray-400">{selectedUser.name}</div>
                <div className="text-sm text-gray-400">Online</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-blue-500 text-xl">
              <button title="Voice Call" className="hover:text-blue-600">
                📞
              </button>
              <button title="Video Call" className="hover:text-blue-600">
                🎥
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500">No user selected</div>
        )}
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.type === 'incoming' ? 'items-start' : 'justify-end items-start'
            } space-x-2 group`}
          >
            {msg.type === 'incoming' && (
              <img src="/bot-avatar.png" className="w-8 h-8 rounded-full" />
            )}

            <div className="relative">
              <div
                className={`p-3 rounded-xl shadow text-sm max-w-xs ${
                  msg.type === 'incoming' ? 'bg-white text-gray-400' : 'bg-blue-500 text-white'
                }`}
              >
                {msg.text}
              </div>

              {/* Reactions */}
              {Object.keys(msg.reactions).length > 0 && (
                <div className="flex space-x-1 text-xs mt-1">
                  {Object.entries(msg.reactions).map(([emoji, count]) => (
                    <div
                      key={emoji}
                      className="bg-white border rounded-full px-2 py-0.5 shadow text-gray-700 select-none"
                    >
                      {emoji} {count}
                    </div>
                  ))}
                </div>
              )}

              {/* Reaction emojis */}
              <div className="absolute top-0 -left-12 hidden group-hover:flex flex-col space-y-1">
                {['👍', '❤️', '😂', '😮', '😢'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => toggleReaction(msg.id, emoji)}
                    className="hover:scale-110 transition text-lg"
                    title={`React with ${emoji}`}
                    type="button"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {msg.type === 'outgoing' && (
              <img src="/user-avatar.png" className="w-8 h-8 rounded-full" />
            )}
          </div>
        ))}
      </main>

      {/* Message Input */}
      <footer className="p-4 bg-white border-t relative">
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <div
          className={`flex items-center space-x-2 p-2 rounded-xl border-2 transition ${
            isDragging ? 'border-blue-400 bg-blue-50' : 'border-transparent'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Hidden File Input */}
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-500 hover:text-blue-600"
            type="button"
          >
            📎
          </button>

          {/* Emoji Button */}
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-blue-500 hover:text-blue-600"
            type="button"
          >
            😊
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder="Type a message or drop a file..."
            className="flex-1 p-2 border rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          {/* Send Button */}
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
