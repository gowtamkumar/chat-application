/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useSocket.ts
"use client";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
export const useSocket = (conversationId: string) => {
  const socketRef = useRef<any>(null);
  const session: any = useSession();

  useEffect(() => {
    const serverPort =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3900";

    socketRef.current = io(serverPort, {
      auth: session.data?.user?.token,
    });

    socketRef.current.emit("join-conversation", { conversationId });

    return () => {
      socketRef.current.disconnect();
    };
  }, [conversationId, session.data?.user?.token]);

  return socketRef;
};
