import { io } from "socket.io-client";

const serverPort = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3900'

const socket = io(serverPort); // adjust port if needed

export default socket;
