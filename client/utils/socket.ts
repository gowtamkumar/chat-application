// utils/socket.ts
import { io, Socket } from "socket.io-client";

export const createSocket = (token: string): Socket => {
  const serverPort =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3900";

  return io(serverPort, {
    auth: {
      token,
    },
  });
};
