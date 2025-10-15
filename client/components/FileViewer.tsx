/* eslint-disable @typescript-eslint/no-explicit-any */
import { Image } from "antd";
// import Image from "next/image";
import ReactAudioPlayer from "react-audio-player";
import ReactPlayer from "react-player";
import PdfViewer from "./PdfViewer";

// export default function ViewFile({ file }: any) {
//   return (
//     <div>
//       <Image
//         width={100}
//         height={100}
//         src={`${process.env.NEXT_PUBLIC_SOCKET_URL}/uploads/${file}`}
//       />
//     </div>
//   );
// }

export default function FileViewer({ file }: any) {
  const { pdf, mp4, fileData, imgStyle } = file;


  return (
    <>
      {fileData?.filetype === "application/pdf" ? (
        <PdfViewer
          pdf={pdf}
          file={`${process.env.NEXT_PUBLIC_SOCKET_URL}/uploads/${fileData.filename}`}
        />
      ) : fileData?.filetype === "video/mp4" ? (
        <ReactPlayer
          src={`${process.env.NEXT_PUBLIC_SOCKET_URL}/uploads/${fileData.filename}`}
          controls
          width={mp4.width}
          height={mp4.height}
        />
      ) : fileData?.filetype === "audio/mpeg" ? (
        <ReactAudioPlayer
          src={`${process.env.NEXT_PUBLIC_SOCKET_URL}/uploads/${fileData.filename}`}
          controls
        />
      ) : (
        <Image
          src={`${process.env.NEXT_PUBLIC_SOCKET_URL}/uploads/${fileData.filename}`}
          width={imgStyle.width}
          height={imgStyle.height}
          alt={fileData?.originalname}
          className={imgStyle.className}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
    </>
  );
}
