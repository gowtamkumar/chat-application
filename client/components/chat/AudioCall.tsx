/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoIosCall } from "react-icons/io";
import { Socket } from "socket.io-client";

interface AudioCallProps {
  socket: Socket; // initialized socket instance
  targetUserId: string; // the user you want to call (their userId)
}

export default function AudioCall({ socket, targetUserId }: AudioCallProps) {
  const { data: session } = useSession() as any;
  const currentUserId = session?.user?.user?.id;

  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "in-call">(
    "idle"
  );
  const [muted, setMuted] = useState(false);

  const iceServers: RTCConfiguration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  // Start local audio and store ref
  const startLocalAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      if (localAudioRef.current) localAudioRef.current.srcObject = stream;
      return stream;
    } catch (err) {
      console.error("Error accessing microphone:", err);
      return null;
    }
  }, []);

  // Create/return a stable peer connection
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(iceServers);

    pc.ontrack = (event) => {
      // first stream's first track
      if (remoteAudioRef.current)
        remoteAudioRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && targetUserId && currentUserId) {
        socket.emit("ice-candidate", {
          to: targetUserId,
          from: currentUserId,
          candidate: event.candidate,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        // End call if connection dies
        endCall();
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [socket, targetUserId, currentUserId]);

  // End call & cleanup (stops local tracks and closes pc)
  const endCall = useCallback(() => {
    try {
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;
    } catch (e) {
      console.warn("Error closing peer connection:", e);
    }

    // stop local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    if (localAudioRef.current) localAudioRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;

    setCallStatus("idle");

    // notify remote user
    if (socket && targetUserId && currentUserId) {
      socket.emit("end-call", { to: targetUserId, from: currentUserId });
    }
  }, [socket, targetUserId, currentUserId]);

  // Start call (caller)
  const startCall = useCallback(async () => {
    if (!currentUserId || !targetUserId) return;

    setCallStatus("calling");
    const stream = await startLocalAudio();
    if (!stream) {
      setCallStatus("idle");
      return;
    }

    const pc = createPeerConnection();
    // attach local audio tracks
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("call-user", {
        to: targetUserId,
        from: currentUserId,
        offer,
      });
    } catch (err) {
      console.error("Error creating offer:", err);
      endCall();
    }
  }, [
    currentUserId,
    targetUserId,
    createPeerConnection,
    startLocalAudio,
    socket,
    endCall,
  ]);

  // Toggle mute local mic
  function toggleMute() {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setMuted((m) => !m);
  }

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    // Incoming call (receiver)
    const onCallMade = async (data: any) => {
      // server should send { from, offer }
      if (!data?.from || !data?.offer) return;

      // If already in call, optionally reject or notify
      if (callStatus === "in-call" || callStatus === "calling") {
        // optional: emit busy / reject
        return;
      }

      const accept = confirm("Incoming audio call. Accept?");
      if (!accept) {
        // optionally notify caller of rejection
        return;
      }

      setCallStatus("in-call");
      const stream = await startLocalAudio();
      if (!stream) {
        setCallStatus("idle");
        return;
      }

      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("make-answer", {
          to: data.from,
          from: currentUserId,
          answer,
        });
      } catch (err) {
        console.error("Error handling incoming call:", err);
        endCall();
      }
    };

    // Caller receives answer
    const onAnswerMade = async (data: any) => {
      // server sends { from, answer }
      if (!data?.answer) return;
      try {
        await peerConnectionRef.current?.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
        setCallStatus("in-call");
      } catch (err) {
        console.error("Error setting remote description from answer:", err);
        endCall();
      }
    };

    // ICE candidate from remote
    const onIceCandidate = async (data: any) => {
      // server sends { from, candidate }
      if (!data?.candidate) return;
      try {
        await peerConnectionRef.current?.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      } catch (err) {
        console.error("Error adding remote ICE candidate:", err);
      }
    };

    const onCallEnded = (data: any) => {
      endCall();
    };

    socket.on("call-made", onCallMade);
    socket.on("answer-made", onAnswerMade);
    socket.on("ice-candidate", onIceCandidate);
    socket.on("call-ended", onCallEnded);

    return () => {
      socket.off("call-made", onCallMade);
      socket.off("answer-made", onAnswerMade);
      socket.off("ice-candidate", onIceCandidate);
      socket.off("call-ended", onCallEnded);
    };
  }, [
    socket,
    callStatus,
    createPeerConnection,
    startLocalAudio,
    endCall,
    currentUserId,
  ]);

  console.log("end call");

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      try {
        endCall();
      } catch { }
    };
  }, []);

  return (
    <div className="flex flex-row items-center justify-between">
      {/* <div className="flex"> */}
      {/* <h2 className="text-lg font-bold">🎧 </h2> */}
      <audio ref={localAudioRef} autoPlay muted className="hidden" />
      <audio ref={remoteAudioRef} autoPlay className="w-full rounded" />

      <p className="p-2"> {callStatus}</p>

      {callStatus === "idle" && (
        <button
          onClick={startCall}
          className="bg-blue-600 text-white px-2 py-2 rounded-md"
        >
          <IoIosCall />
        </button>
      )}

      {callStatus === "in-call" && (
        <button
          onClick={toggleMute}
          className={`px-2 py-1 rounded-md ${muted ? "bg-red-500" : "bg-green-500"
            } text-white`}
        >
          {muted ? "Unmute" : "Mute"}
        </button>
      )}

      {callStatus !== "idle" && (
        <div className="flex gap-2">
          <button
            onClick={endCall}
            className="px-2 py-1 rounded-md bg-red-500 text-white"
          >
            End
          </button>
        </div>
      )}

      {/* {callStatus === "in-call" && (
        <div className="flex gap-2">
          <button
            onClick={toggleMute}
            className={`px-3 py-1 rounded-md ${muted ? "bg-red-500" : "bg-green-500"
              } text-white`}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            onClick={endCall}
            className="px-3 py-1 rounded-md bg-gray-800 text-white"
          >
            End Call
          </button>
        </div>
      )} */}
      {/* </div> */}
    </div>
  );
}
