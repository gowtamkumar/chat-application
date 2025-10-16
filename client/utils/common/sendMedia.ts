/* eslint-disable @typescript-eslint/no-explicit-any */

import { uploadFile } from "../api/file";

// import { uploadFile } from "@/utils/api/file";
export const sendMedia = async ({ setFile, uploadFiles }: any) => {
  if (!uploadFiles) return;
  const formData = new FormData();
  formData.append("file", uploadFiles);

  try {
    const res = await uploadFile(formData);

    if (res.success) {
      setFile(res.data);
      // alert(`"${res.message}"`);
    }
  } catch (err) {
    console.error("🚀 ~ Upload error:", err);
    alert(err);
  }
};
