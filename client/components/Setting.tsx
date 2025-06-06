"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [username, setUsername] = useState("alice_johnson");
  const [email, setEmail] = useState("alice.johnson@example.com");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);

    // Simulate API save delay
    setTimeout(() => {
      alert(`Settings saved!\n
Username: ${username}
Email: ${email}
Notifications: ${notificationsEnabled ? "On" : "Off"}
Dark Mode: ${darkMode ? "On" : "Off"}
Auto Update: ${autoUpdate ? "On" : "Off"}
      `);
      setSaving(false);
    }, 1500);
  };

  return (
    <div className="mx-auto p-6 bg-white mt-10">

      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Settings</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-8"
      >
        {/* Profile Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Profile</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="username"
                className="block font-medium text-gray-600 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                minLength={3}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-medium text-gray-600 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Preferences
          </h2>

          <div className="space-y-4">
            {/* Notification Toggle */}
            <ToggleSwitch
              label="Enable Notifications"
              enabled={notificationsEnabled}
              onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
            />

            {/* Dark Mode Toggle */}
            <ToggleSwitch
              label="Dark Mode"
              enabled={darkMode}
              onToggle={() => setDarkMode(!darkMode)}
            />

            {/* Auto Update Toggle */}
            <ToggleSwitch
              label="Auto Update"
              enabled={autoUpdate}
              onToggle={() => setAutoUpdate(!autoUpdate)}
            />
          </div>
        </section>

        {/* Save Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className={`w-full sm:w-auto px-8 py-3 rounded-full font-semibold text-white ${saving
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
              } transition`}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable toggle switch component
function ToggleSwitch({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 font-medium">{label}</span>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={enabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${enabled ? "bg-indigo-600" : "bg-gray-300"
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </button>
    </div>
  );
}
