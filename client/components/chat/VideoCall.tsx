/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

interface VideoCallProps {
  socket: Socket;
  targetUserId: string;
}

export default function VideoCall({ socket, targetUserId }: VideoCallProps) {
  const { data: session } = useSession() as any;
  const currentUserId = session?.user?.user?.id;

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "in-call">(
    "idle"
  );
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  const iceServers: RTCConfiguration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  // 🎥 Start camera + mic
  // const startLocalStream = useCallback(async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     });
  //     localStreamRef.current = stream;
  //     if (localVideoRef.current) localVideoRef.current.srcObject = stream;
  //     return stream;
  //   } catch (err) {
  //     console.error("Error accessing camera/mic:", err);
  //     alert("Please allow camera and microphone access.");
  //     return null;
  //   }
  // }, []);

  const startLocalStream = useCallback(async () => {
    try {
      // stop existing stream if already running
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      console.log(
        "🎙️ Local tracks:",
        stream.getTracks().map((t) => ({ kind: t.kind, enabled: t.enabled }))
      );

      return stream;
    } catch (err: any) {
      console.error("Error accessing camera/mic:", err.name, err.message);

      if (err.name === "NotReadableError") {
        alert(
          "Your camera or microphone is already in use by another application. Please close it and try again."
        );
      } else if (err.name === "NotAllowedError") {
        alert("Please allow camera and microphone access.");
      } else {
        alert(`Camera/mic access error: ${err.message}`);
      }

      return null;
    }
  }, []);


  // 🔚 End call
  const endCall = useCallback(() => {
    try {
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;
    } catch { }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setCallStatus("idle");

    if (socket && targetUserId && currentUserId) {
      socket.emit("end-call", { to: targetUserId, from: currentUserId });
    }
  }, [socket, targetUserId, currentUserId]);
  // 🔗 Create PeerConnection
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(iceServers);

    pc.ontrack = (event) => {
      console.log("📡 Received remote stream:", event.streams[0]);

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current
          .play()
          .catch((err) => console.warn("Auto-play blocked:", err));
      }
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
        pc.connectionState === "failed" ||
        pc.connectionState === "disconnected"
      ) {
        endCall();
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [iceServers, targetUserId, currentUserId, socket, endCall]);

  // 📞 Start call
  const startCall = useCallback(async () => {
    if (!currentUserId || !targetUserId) return;

    setCallStatus("calling");

    const stream = await startLocalStream();


    if (!stream) {
      setCallStatus("idle");
      return;
    }
    const pc = createPeerConnection();
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
    socket,
    startLocalStream,
    createPeerConnection,
    endCall,
  ]);

  // 🎤 Toggle mic
  const toggleMute = () => {
    localStreamRef.current
      ?.getAudioTracks()
      .forEach((t) => (t.enabled = !t.enabled));
    setMuted((m) => !m);
  };

  // 🎥 Toggle camera
  const toggleCamera = () => {
    localStreamRef.current
      ?.getVideoTracks()
      .forEach((t) => (t.enabled = !t.enabled));
    setCameraOff((v) => !v);
  };

  // ⚡ Socket listeners
  useEffect(() => {
    if (!socket) return;

    const onCallMade = async (data: any) => {
      if (!data?.from || !data?.offer) return;

      const accept = confirm("Incoming video call. Accept?");
      if (!accept) return;

      setCallStatus("in-call");
      const stream = await startLocalStream();
      console.log("in-call", stream);

      if (!stream) return;

      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("make-answer", {
        to: data.from,
        from: currentUserId,
        answer,
      });
    };

    const onAnswerMade = async (data: any) => {
      if (!data?.answer) return;
      console.log("onAnswerMade");

      await peerConnectionRef.current?.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      console.log("✅ Remote description set, waiting for ontrack...");
      setCallStatus("in-call");
    };

    const onIceCandidate = async (data: any) => {
      if (!data?.candidate) return;
      await peerConnectionRef.current?.addIceCandidate(
        new RTCIceCandidate(data.candidate)
      );
    };

    const onCallEnded = () => {
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
  }, [socket, createPeerConnection, startLocalStream, endCall, currentUserId]);

  // 🧹 Cleanup
  useEffect(() => {
    return () => endCall();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 bg-gray-100 p-4 rounded-lg w-96">
      <h2 className="text-lg font-bold">🎥 Video Call</h2>

      <div className="relative flex gap-2">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-32 h-32 bg-black rounded-md object-cover"
        />

        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-64 h-64 bg-black rounded-md object-cover"
        />
      </div>

      <p>Status: {callStatus}</p>

      {callStatus === "idle" && (
        <button
          onClick={startCall}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Start Call
        </button>
      )}

      {callStatus === "calling" && <p>📞 Calling...</p>}

      {callStatus === "in-call" && (
        <div className="flex gap-2">
          <button
            onClick={toggleMute}
            className={`px-3 py-1 rounded-md ${muted ? "bg-red-500" : "bg-green-500"
              } text-white`}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            onClick={toggleCamera}
            className={`px-3 py-1 rounded-md ${cameraOff ? "bg-red-500" : "bg-green-500"
              } text-white`}
          >
            {cameraOff ? "Camera On" : "Camera Off"}
          </button>
          <button
            onClick={endCall}
            className="px-3 py-1 rounded-md bg-gray-800 text-white"
          >
            End Call
          </button>
        </div>
      )}
    </div>
  );
}
