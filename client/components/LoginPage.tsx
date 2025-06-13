'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    // Save login to localStorage (mock auth)
    localStorage.setItem('chat-user', JSON.stringify({ username, avatarUrl }));
    router.push('/chat'); // Replace with your actual chat route
  };

  //  const handleSubmit = async (values: any) => {
  //   dispatch(setLoading({ save: true }));
  //   try {
  //     const result: any = await signIn("credentials", {
  //       ...values,
  //       redirect: false,
  //     });

  //     if (result?.error) {
  //       dispatch(
  //         setResponse({ type: "error", message: "Invalid Login Credentials" })
  //       );
  //       dispatch(setLoading({ save: false }));
  //       return;
  //     }

  //     // Wait for session to reflect login — loop check or force reload
  //     const checkSession = async (): Promise<any> => {
  //       for (let i = 0; i < 10; i++) {
  //         const session = await getSession();
  //         if (session?.user) return session;
  //         await new Promise((r) => setTimeout(r, 300));
  //       }
  //       return null;
  //     };

  //     const session = await checkSession();

  //     if (!session?.user) {
  //       dispatch(
  //         setResponse({
  //           type: "error",
  //           message: "Login succeeded but session failed",
  //         })
  //       );
  //       dispatch(setLoading({ save: false }));
  //       return;
  //     }

  //     // Load user cart
  //     const cart = await fetchCartData();
  //     dispatch(replaceCart(cart));

  //     // Navigate based on user role
  //     if (session.user.role === "Admin") {
  //       router.push("/dashboard");
  //     } else {
  //       router.push("/");
  //     }
  //   } catch (err: any) {
  //     console.error("Login error:", err);
  //     dispatch(setResponse({ type: "error", message: "Something went wrong" }));
  //   } finally {
  //     dispatch(setLoading({ save: false }));
  //   }
  // };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome to Chat App</h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
              Avatar URL (optional)
            </label>
            <input
              id="avatar"
              type="text"
              placeholder="https://example.com/avatar.png"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Login
          </button>
        </form>
         <p className="mt-4 text-sm text-center text-gray-500">
          Already have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            New Account
          </a>
        </p>
      </div>
    </div>
  );
}
