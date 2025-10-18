// // 🎥 Start camera + mic
// export const startLocalStream = useCallback(
//   async ({
//     localStreamRef,
//     localVideoRef,
//     video = false,
//     audio = true,
//     message,
//   }: {
//     localStreamRef: any;
//     localVideoRef?: any;
//     video: boolean;
//     audio: boolean;
//     message: string;
//   }) => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video,
//         audio,
//       });
//       localStreamRef.current = stream;
//       if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//       return stream;
//     } catch (err) {
//       console.error(`Error accessing ${message}:`, err);
//       alert("Please allow camera and microphone access.");
//       return null;
//     }
//   },
//   []
// );
