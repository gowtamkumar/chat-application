Client (React/Next.js) <--> Gateway (Nest.js + Socket.IO/WebRTC) <--> 
Message Queue (Kafka) <--> Services (Chat, Notification, etc.) <--> DB (PostgreSQL, Redis)

Socket.IO = Controls the communication (chat, presence, signaling)

WebRTC = Handles the peer-to-peer streaming (video, audio, screen)
## Stack:
  Layer	Technology
  Frontend	React.js + WebRTC + Socket.IO client
  Backend	Nest.js + Socket.IO (for signaling & chat)
  Media Handling	WebRTC peer connections
  Redis	For scaling Socket.IO across multiple servers
  PostgreSQL / MongoDB	Chat/message storage
  TURN/STUN Servers	For WebRTC to work behind NAT/firewalls (use coturn or services like Twilio/Nexmo)