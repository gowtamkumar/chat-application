/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';

export default function Profile() {
  const [name, setName] = useState('Alice Johnson');
  const [email, setEmail] = useState('alice.johnson@example.com');
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    alert(`Saved:\nName: ${name}\nEmail: ${email}`);
    setEditing(false);
  };

  return (
   <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg mt-8">
      {/* Header */}
      <div className="flex flex-col items-center space-y-4">
        <img
          src="/user-avatar.png"
          alt="User Avatar"
          className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow-md object-cover"
        />
        {!editing ? (
          <>
            <h1 className="text-3xl font-extrabold text-indigo-700">{name}</h1>
            <p className="text-gray-600">{email}</p>
            <button
              onClick={() => setEditing(true)}
              className="mt-3 px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <div className="w-full max-w-md space-y-5">
            <div>
              <label htmlFor="name" className="block font-semibold text-indigo-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-semibold text-indigo-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Additional info / stats */}
      <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-indigo-50 rounded-xl p-6 text-center shadow">
          <h2 className="text-indigo-700 font-bold text-xl">Chats</h2>
          <p className="text-indigo-900 text-3xl mt-2">152</p>
        </div>
        <div className="bg-indigo-50 rounded-xl p-6 text-center shadow">
          <h2 className="text-indigo-700 font-bold text-xl">Groups</h2>
          <p className="text-indigo-900 text-3xl mt-2">12</p>
        </div>
        <div className="bg-indigo-50 rounded-xl p-6 text-center shadow">
          <h2 className="text-indigo-700 font-bold text-xl">Unread</h2>
          <p className="text-indigo-900 text-3xl mt-2">7</p>
        </div>
      </section>

      {/* Logout */}
      <div className="mt-10 text-center">
        <button
          onClick={() => alert('Logging out...')}
          className="px-6 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
