/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useMemo } from 'react';

type User = {
  id: string;
  username: string;
  profile_picture?: string;
  status: 'online' | 'offline' | 'busy' | 'away';
};

type Contact = {
  user_id_1: string;
  user_id_2: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  user: User; // the contact's User data joined from backend
};

type Props = {
  currentUserId: string;
};

export default function ContactModule({ currentUserId }: Props) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch contacts from your backend API
  // Assuming API returns contacts with joined user info (user)
  useEffect(() => {
    async function fetchContacts() {
      const res = await fetch(`/api/contacts?userId=${currentUserId}`);
      if (res.ok) {
        const data: Contact[] = await res.json();
        setContacts(data);
      } else {
        setContacts([]);
      }
    }
    fetchContacts();
  }, [currentUserId]);

  // Filter accepted contacts and search
  const filteredContacts = useMemo(() => {
    return contacts
      .filter((c) => c.status === 'accepted')
      .filter((c) =>
        c.user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [contacts, searchTerm]);

  // Contact requests
  const pendingRequests = useMemo(() => {
    return contacts.filter(
      (c) => c.status === 'pending' && c.user_id_2 === currentUserId
    );
  }, [contacts, currentUserId]);

  // Accept or reject contact request handlers (stub)
  async function acceptRequest(userId: string) {
    await fetch(`/api/contacts/accept`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
      headers: { 'Content-Type': 'application/json' },
    });
    // Refresh contact list
    // Ideally update state instead of refetching
  }

  async function declineRequest(userId: string) {
    await fetch(`/api/contacts/decline`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
      headers: { 'Content-Type': 'application/json' },
    });
    // Refresh contact list
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded shadow h-[600px] flex flex-col">
      <header className="px-6 py-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Contacts</h2>
      </header>

      {/* Search */}
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search contacts..."
          className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Accepted Contacts List */}
      <ul className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 && (
          <li className="text-center text-gray-500 py-10">
            No contacts found.
          </li>
        )}
        {filteredContacts.map((contact) => (
          <li
            key={contact.user.id}
            className="flex items-center px-6 py-3 hover:bg-gray-100 cursor-pointer"
          >
            <img
              src={contact.user.profile_picture || '/default-avatar.png'}
              alt={contact.user.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-4 flex-1">
              <p className="font-semibold text-gray-800">{contact.user.username}</p>
              <p
                className={`text-sm ${
                  contact.user.status === 'online'
                    ? 'text-green-500'
                    : 'text-gray-400'
                }`}
              >
                {contact.user.status}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Pending Requests */}
      <section className="p-4 border-t bg-gray-50">
        <h3 className="font-semibold mb-2">Pending Requests</h3>
        {pendingRequests.length === 0 && (
          <p className="text-gray-500">No pending requests</p>
        )}
        {pendingRequests.map((request) => (
          <div
            key={request.user.id}
            className="flex items-center justify-between mb-2"
          >
            <div className="flex items-center">
              <img
                src={request.user.profile_picture || '/default-avatar.png'}
                alt={request.user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="ml-3 font-medium">{request.user.username}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => acceptRequest(request.user.id)}
                className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => declineRequest(request.user.id)}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
