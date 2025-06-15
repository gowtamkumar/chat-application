import { auth } from "@/auth";
import { io } from "socket.io-client";

const serverPort =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3900";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const session: any = auth();

// console.log("session", session);

const socket = io(serverPort, {
  auth: session.data?.user?.token,
}); // adjust port if needed

export default socket;
