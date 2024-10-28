"use client";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, notification } from "antd";
import type { GetProp, UploadFile, UploadProps, FormProps } from "antd";
import Loading from "../component/loading";
import CreateBlogProtectedRoutes from "../HOC/createblog-protected";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function NewBlog() {
  const [api, contextHolder] = notification.useNotification();

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Category");
  const [content, setContent] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    console.log(newFileList);
    setFileList(newFileList);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const uploading = (placement: "topRight") => {
    api.info({
      message: `Uploading`,
      description: "Please wait...",
      placement,
    });
  };

  const uploaded = (placement: "topRight") => {
    api.success({
      message: `Published!`,
      description: "Your blog has been published ",
      placement,
    });
  };

  function createBlog() {
    if (title && category && content) {
      let blog = {
        title,
        category,
        content,
        image: fileList[0] || null,
      };
      console.log(blog);

      setTitle("");
      setCategory("Category");
      setContent("");
      setFileList([]);
      uploading("topRight");

      setTimeout(() => {
        uploaded("topRight");
      }, 3000);
    } else {
      ErrorDuration();
      console.log("Fill all field");
    }
  }

  function ErrorDuration() {
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 4000);
  }

  return isLoading ? (
    <Loading />
  ) : (
    <CreateBlogProtectedRoutes>
      <>
        {contextHolder}
        <div
          className=""
          style={{
            maxWidth: "600px",
            margin: "auto",
            display: "flex",
            // justifyContent: "center",
            flexDirection: "column",
            padding: "20px",
            gap: "20px",
          }}
        >
          <Upload
            // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            className="accent-content"
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>

          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}

          <input
            type="text"
            placeholder="Title"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />

          <select
            className="select select-bordered w-full"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option disabled selected value={"Category"}>
              Select Category
            </option>
            <option>Han Solo</option>
            <option>Greedo</option>
          </select>

          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            className="textarea textarea-bordered"
            placeholder="Content"
          ></textarea>

          {showError && (
            <div role="alert" className="alert alert-error">
              <span>Error : Please fill all fields</span>
            </div>
          )}
          <button className="btn btn-neutral" onClick={createBlog}>
            Create blog
          </button>
        </div>
      </>
    </CreateBlogProtectedRoutes>
  );
}
