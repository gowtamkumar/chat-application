/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/auth";
import { io } from "socket.io-client";

const serverPort =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3900";

// Get session and then connect (async/await required)
const socketPromise = (async () => {
  const session: any = await auth();
  const socket = io(serverPort, {
    auth: {
      token: session?.data?.user?.token,
    },
  });
  return socket;
})();

export default socketPromise;

