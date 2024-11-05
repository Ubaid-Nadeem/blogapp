"use client";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, notification } from "antd";
import type { GetProp, UploadFile, UploadProps, FormProps } from "antd";
import Loading from "../component/loading";
import CreateBlogProtectedRoutes from "../HOC/createblog-protected";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase/firebaseconfiq";
import { getAuth } from "firebase/auth";

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
  const [imageFile,setImageFile] = useState<any>();
  const [imageName,setImageName] = useState("")
  const [isActive, setIsActive] = useState(false);

  const storage = getStorage();
  const db = getFirestore(app);
  const auth = getAuth();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // save picture in data base

  function UploadImage() {
    let extension = fileList[0]?.name.split(".")[1];
    let uuid = crypto.randomUUID();
    let file = fileList[0].originFileObj;
    let PhotoRef = `${uuid}.${extension}`;
    setImageName(PhotoRef)
    setImageFile(file)
    const storageRef = ref(storage, `blogimages/${PhotoRef}`);

    const uploadTask = uploadBytesResumable(storageRef, file as FileType);
 
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          SaveBlogDB(downloadURL,PhotoRef);
        });
      }
    );
  }

  // save blog in data base

  async function SaveBlogDB(downloadURL: string | null,PhotoRef : string) {
    let docRef = collection(db, "blogs");
    let currentTime = new Date();
    let blog = {
      title,
      category,
      content,
      imageURL: downloadURL,
      uid: auth.currentUser?.uid,
      likes: [],
      date: currentTime,
      userName: auth.currentUser?.displayName,
      profilePicture: auth.currentUser?.photoURL,
      imageName : PhotoRef
    };
    try {
      await addDoc(docRef, blog);
      setTitle("");
      setCategory("Category");
      setContent("");
      setFileList([]);
      uploaded("topRight");
      setIsActive(false);
    } catch (error) {
      console.log(error);
    }
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
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

  // function call on create btn

  function createBlog() {
    if (title && category && content) {
      setIsActive(true);
      uploading("topRight");
      if (fileList[0]) {
        UploadImage();
      } else {
        SaveBlogDB(null,"");
      }
    } else {
      ErrorDuration();
      console.log("Fill all field");
    }
  }

  // show and hide error

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
            <option>Lifestyle</option>
            <option>Personal blogs</option>
            <option>Food</option>
            <option>Fitness</option>
            <option>Travel</option>
            <option>Fashion</option>
            <option>News</option>
            <option>Blogging</option>
            <option>Video Game</option>
            <option>Music</option>
            <option>Sports</option>
            <option>Marketing</option>
            <option>Politics</option>
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
          <button
            className="btn btn-neutral"
            onClick={createBlog}
            disabled={isActive}
          >
            Create blog
          </button>
        </div>
      </>
    </CreateBlogProtectedRoutes>
  );
}
