/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendMedia } from "@/utils/common/sendMedia";
import { Button } from "antd";
import { useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";

export default function VoiceRecorder({ setFile }: any) {
  const [isRecording, setIsRecording] = useState(false);
  const [uploadFiles, setUploadFile] = useState<File | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm",
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const file = new File([blob], `voice_${Date.now()}.webm`, {
        type: "audio/webm",
      });
      setUploadFile(file);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
    sendMedia({ setFile, uploadFiles });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {!isRecording ? (
        <Button onClick={startRecording}>
          <FaMicrophone size={20} />
        </Button>
      ) : (
        <Button onClick={stopRecording}>⏹ Stop Recording</Button>
      )}
    </div>
  );
}
