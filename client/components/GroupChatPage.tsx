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
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingType, setRecordingType] = useState<'audio' | 'video' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const livePreviewRef = useRef<HTMLVideoElement>(null);

  const currentUserId = 1;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('Selected file:', files[0]);
      // TODO: implement file upload
    }
  };

  const startCall = async (type: 'audio' | 'video') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        type === 'video'
          ? { video: true, audio: true }
          : { video: false, audio: true }
      );
      setLocalStream(stream);
      setCallType(type);

      const otherUser = users.find((u) => u.id !== currentUserId) ?? null;
      setSelectedUser(otherUser);
    } catch (err) {
      alert('Failed to access media devices.');
      console.error(err);
    }
  };

  const stopCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setLocalStream(null);
    setCallType(null);
    setSelectedUser(null);
  };

  const startRecording = async (type: 'audio' | 'video') => {
    try {
      const constraints =
        type === 'video'
          ? { video: true, audio: true }
          : { video: false, audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const recorder = new MediaRecorder(stream);

      setMediaStream(stream);
      setMediaRecorder(recorder);
      setRecordingType(type);
      setRecordedChunks([]);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setRecordedChunks((prev) => [...prev, e.data]);
        }
      };

      recorder.start();

      if (livePreviewRef.current && type === 'video') {
        livePreviewRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Could not access media devices.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) mediaRecorder.stop();
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    setMediaStream(null);
    setMediaRecorder(null);
  };

  const sendRecording = () => {
    const blob = new Blob(recordedChunks, {
      type: recordingType === 'video' ? 'video/webm' : 'audio/webm',
    });
    const url = URL.createObjectURL(blob);

    const mediaHTML =
      recordingType === 'video'
        ? `<video src="${url}" controls class="rounded-lg max-w-xs" />`
        : `<audio src="${url}" controls class="w-full" />`;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        userId: currentUserId,
        text: mediaHTML,
      },
    ]);

    setRecordingType(null);
    setRecordedChunks([]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {users.slice(0, 3).map((user) => (
              <img
                key={user.id}
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            ))}
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

        <div className="flex items-center space-x-4 text-blue-500 text-xl">
          <button
            title="Start Voice Call"
            className="hover:text-blue-600"
            onClick={() => startCall('audio')}
            type="button"
          >
            📞
          </button>
          <button
            title="Start Video Call"
            className="hover:text-blue-600"
            onClick={() => startCall('video')}
            type="button"
          >
            🎥
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const user = getUser(msg.userId);
          const isCurrentUser = msg.userId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isCurrentUser && (
                <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full" />
              )}
              <div
                className={`p-3 rounded-xl shadow text-sm max-w-xs break-words ${
                  isCurrentUser ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
              >
                {!isCurrentUser && (
                  <div className="text-xs font-semibold mb-1 text-gray-500">{user?.name}</div>
                )}
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              </div>
              {isCurrentUser && (
                <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full" />
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
          <button onClick={() => fileInputRef.current?.click()} className="text-blue-500" type="button">
            📎
          </button>
          <button onClick={() => setShowEmojiPicker((prev) => !prev)} className="text-blue-500" type="button">
            😊
          </button>
          <button onClick={() => startRecording('audio')} className="text-blue-500" type="button">
            🎙️
          </button>
          <button onClick={() => startRecording('video')} className="text-blue-500" type="button">
            📹
          </button>
          <input
            type="text"
            placeholder="Type a message..."
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

      {recordingType && (
        <div className="fixed bottom-24 left-4 bg-white shadow-xl p-4 rounded-xl z-40">
          <div className="flex flex-col items-center space-y-2">
            {recordingType === 'video' && (
              <video
                ref={livePreviewRef}
                autoPlay
                muted
                playsInline
                className="w-64 h-48 bg-black rounded-md"
              />
            )}
            {recordingType === 'audio' && <div className="text-gray-600">🎤 Recording...</div>}
            <div className="flex space-x-2">
              <button onClick={stopRecording} className="bg-red-600 text-white px-4 py-1 rounded">
                Stop
              </button>
              <button onClick={sendRecording} className="bg-blue-500 text-white px-4 py-1 rounded">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {callType && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-semibold text-center">
              {callType === 'audio' ? 'Voice Call' : 'Video Call'} with {selectedUser?.name ?? 'User'}
            </h2>
            {callType === 'video' ? (
              <video ref={videoRef} autoPlay muted playsInline className="w-72 h-48 bg-gray-900 rounded-md" />
            ) : (
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-blue-500 text-white text-4xl">
                🎙️
              </div>
            )}
            <button onClick={stopCall} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full">
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
