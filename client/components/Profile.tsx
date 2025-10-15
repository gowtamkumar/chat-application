/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { userUpdate } from "@/utils/api/user";
import { Button, Input } from "antd";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import FileViewer from "./FileViewer";
import Header from "./Header";

export default function Profile() {
  const [file, setFile] = useState({} as any);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const session: any = useSession();
  const profile = session?.data?.user?.user;

  useEffect(() => {
    setEmail(profile.email);
    setName(profile.name);
    setFile({ filename: profile.file });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Validate input before sending
      if (!name.trim() || !email.trim()) {
        alert("Name and email are required.");
        return;
      }

      if (!file?.filename) {
        alert("Please upload a file before saving.");
        return;
      }

      const userData = { name, email, file: file.filename };

      const response = await userUpdate(userData);

      // Handle API response
      if (response?.success) {
        const user = response.data;

        setName(user.name);
        setEmail(user.email);
        setFile({ filename: user.file });
        setEditing(false);
        setLoading(false);
        alert("Profile updated successfully!");
      } else {
        throw new Error(response?.message || "Failed to update user.");
      }
    } catch (error: any) {
      console.error("🚨 Error updating user:", error);

      // Handle both API and unexpected errors
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong while updating your profile.";

      alert(errorMessage);
    }
  };

  return (
    <div>
      <Header />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center   font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] py-10 row-start-2 items-center sm:items-start">
          <div className="mx-auto p-6 bg-white mt-10">
            <div className="flex flex-col items-center space-y-4">
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
                    className:
                      "w-28 h-28 rounded-full border-4 border-indigo-500 shadow-md object-cover",
                  },
                  fileData: {
                    filename: file.filename,
                    filetype: file.mimetype,
                  },
                }}
              />

              {!editing ? (
                <>
                  <h1 className="text-3xl font-extrabold text-indigo-700">
                    {profile.name}
                  </h1>
                  <p className="text-gray-600">{profile.email}</p>
                  <Button
                    onClick={() => setEditing(true)}
                    size="large"
                    className="mt-3 px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition cursor-pointer"
                  >
                    Edit Profile
                  </Button>
                </>
              ) : (
                <div className="w-full max-w-md space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-semibold text-indigo-700 mb-1"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      size="large"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block font-semibold text-indigo-700 mb-1"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      size="large"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <FileUpload
                    setFile={setFile}
                    fieldname="file"
                    listType="picture-card"
                  />

                  <div className="flex justify-end space-x-3">
                    <Button
                      onClick={() => {
                        setEditing(false);
                        setLoading(false);
                      }}
                      size="large"
                      className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      loading={loading}
                      size="large"
                      className="px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                    >
                      Save
                    </Button>
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
              <Button
                danger
                size="large"
                onClick={() => signOut()}
                className="px-6 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition cursor-pointer"
              >
                Logout
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
