/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button, Input } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Header from "./Header";

export default function SettingsPage() {
  const [name, setname] = useState("alice_johnson");
  const [email, setEmail] = useState("alice.johnson@example.com");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [saving, setSaving] = useState(false);

  const session: any = useSession();
  const profile = session?.data?.user?.user;

  useEffect(() => {
    setEmail(profile.email);
    setname(profile.name);
  }, []);

  const handleSave = () => {
    setSaving(true);

    const fetchData = async () => {
      const userData = {
        name,
        email,
      };
      const getData = await fetch(
        `http://localhost:3900/api/v1/users/${profile.id}`,
        {
          method: "PUT",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.user?.accessToken}`,
          },
        }
      );
      const newusers = await getData.json();
      console.log("newusers", newusers);

      // setUsers(newusers.data);
    };

    fetchData();

    // Simulate API save delay
    setTimeout(() => {
      alert(`Settings saved!\n
name: ${name}
Email: ${email}
Notifications: ${notificationsEnabled ? "On" : "Off"}
Dark Mode: ${darkMode ? "On" : "Off"}
Auto Update: ${autoUpdate ? "On" : "Off"}
      `);
      setSaving(false);
    }, 1500);
  };

  return (
    <div>
      <Header />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center   font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] py-10 row-start-2 items-center sm:items-start">
          <div className="mx-auto p-6 bg-white mt-10">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">
              Settings
            </h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-8"
            >
              {/* Profile Section */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  Profile
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-medium text-gray-600 mb-1"
                    >
                      name
                    </label>
                    <Input
                      size="large"
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      disabled
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
                    <Input
                      size="large"
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
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
                    onToggle={() =>
                      setNotificationsEnabled(!notificationsEnabled)
                    }
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
                <Button
                  htmlType="submit"
                  disabled={saving}
                  size="large"
                  className={`w-full sm:w-auto px-8 py-3 rounded-full font-semibold text-white ${saving
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                    } transition`}
                >
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
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
