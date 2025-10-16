/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { sendMedia } from "@/utils/common/sendMedia";
import { useRef, useState } from "react";

export default function CameraCapture({ setFile, setIsModalOpen }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Start camera preview
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  // Capture Photo
  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current!.videoWidth;
    canvas.height = videoRef.current!.videoHeight;
    canvas.getContext("2d")!.drawImage(videoRef.current!, 0, 0);
    canvas.toBlob(async (blob) => {
      const uploadFiles = new File([blob!], `photo_${Date.now()}.png`, {
        type: "image/png",
      });

      await sendMedia({ setFile, uploadFiles });
    }, "image/png");
    setIsModalOpen(false);
  };

  // Start Recording Video
  const startRecording = () => {
    const stream = videoRef.current!.srcObject as MediaStream;
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const localChunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) localChunks.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(localChunks, { type: "video/webm" });
      const uploadFiles = new File([blob], `video_${Date.now()}.webm`, {
        type: "video/webm",
      });
      await sendMedia({ setFile, uploadFiles });
      setIsModalOpen(false);
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <video ref={videoRef} className="w-80 h-60 border" autoPlay />
      <div className="flex gap-2">
        <button
          onClick={startCamera}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Start Camera
        </button>
        <button
          onClick={capturePhoto}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          📷 Capture Photo
        </button>
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-purple-500 text-white px-3 py-1 rounded"
          >
            🎥 Record Video
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            ⏹ Stop Recording
          </button>
        )}
      </div>
    </div>
  );
}
