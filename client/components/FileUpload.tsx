/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
import { uploadFile } from "@/utils/api/file";
import { Upload } from "antd";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function FileUpload({ setFile, fieldname, listType }: any) {
  // const [form] = Form.useForm();

  // const normFile = (e: { fileList: string }) => {
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e && e.fileList;
  // };

  const customUploadRequest = async (options: any) => {
    const { filename, file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append(filename, file);

    try {
      const res = await uploadFile(formData);


      if (res.success) {
        setFile(res.data);
        alert(`"${res.message}"`);
      }

      onSuccess("Ok");
    } catch (err) {
      console.error("🚀 ~ Upload error:", err);
      alert(err);
      onError({ err });
    }
  };

  return (
    <div className="flex items-center">
      <Upload
        name={fieldname}
        listType={listType}
        showUploadList={false}
        customRequest={customUploadRequest}
        maxCount={1}
        className="flex items-center"
      >
        <FaCloudUploadAlt
          size={22}
          className="cursor-pointer text-blue-500 hover:text-blue-600 transition"
        />
      </Upload>
    </div>
  );
}
