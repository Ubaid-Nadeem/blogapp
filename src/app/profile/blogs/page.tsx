"use client";

import { useAuthContext } from "@/app/context/context";
import { auth, db } from "@/app/firebase/firebaseconfiq";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDocs,
  query,
  setDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import Loading from "@/app/component/loading";
import { Image, Upload, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { GetProp, UploadFile, UploadProps, FormProps, message } from "antd";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function MyBlogs() {
  const { user, setUser } = useAuthContext()!;
  const [allBlogs, setAllBlogs] = useState<any>([]);
  const [isLoading, setIsloading] = useState(true);
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
  const [imgName, setImgName] = useState("");

  const [blogIndex, setBlogIndex] = useState<number>(0);
  const [blogID, setblogID] = useState<string>("");

  const [messageApi, contextHolder] = message.useMessage();

  const [isActive, setIsActive] = useState(false);
  const [isUpdatedBlog, setIsUpadtedBlog] = useState(false);
  const route = useRouter();
  const storage = getStorage();

  useEffect(() => {
    getBlogs();
  }, [user]);

  const updateSuccess = () => {
    messageApi.open({
      type: "success",
      content: "Update Successfu  l",
    });
  };

  const errorNotification = () => {
    messageApi.open({
      type: "error",
      content: "Something wrong try again",
    });
  };

  const deleteSuccess = () => {
    messageApi.open({
      type: "success",
      content: "Delete Successful",
    });
  };

  async function getBlogs() {
    if (user) {
      let blogs: any = [];
      const blogRef = collection(db, "blogs");
      const q = query(blogRef, where("uid", "==", user?.uid));

      try {
        const userSnapShot = await getDocs(q);
        userSnapShot.docs.forEach((blog) => {
          blogs.push({ ...blog.data(), id: blog.id });
        });
        setAllBlogs(blogs);
        setIsloading(false);
      } catch (e) {
        setIsloading(false);
      }
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

  const setValues = (blog: any) => {
    console.log(blog);
    setTitle(blog.title);
    setCategory(blog.category);
    setContent(blog.content);

    setImgName(blog.imageName);

    if (blog.imageURL == null) {
      setFileList([]);
    } else {
      setPreviewImage(blog.imageURL);
      setFileList([
        {
          uid: "1",
          name: "image.png",
          status: "done",
          url: blog.imageURL,
        },
      ]);
    }
  };

  function updateBlog() {
    setIsActive(true);
    setIsUpadtedBlog(true);
    if (fileList[0]) {
      if (fileList[0].name != "image.png") {
        deleteImageDb();
      } else {
        SaveBlogDB(fileList[0].url as string | null, imgName);
      }
    } else {
      console.log("blog updating");
      SaveBlogDB(null, "");
    }
  }

  function UploadImage() {
    let extension = fileList[0]?.name.split(".")[1];
    let uuid = crypto.randomUUID();
    let file = fileList[0].originFileObj;
    let PhotoRef = `${uuid}.${extension}`;
    setImgName(PhotoRef);

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
        errorNotification();
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          SaveBlogDB(downloadURL, PhotoRef);
        });
      }
    );
  }

  async function SaveBlogDB(downloadURL: string | null, PhotoRef: string) {
    let docRef = doc(db, "blogs", blogID);

    let blog = {
      title,
      category,
      content,
      imageURL: downloadURL,
      imageName: PhotoRef,
    };
    try {
      await setDoc(docRef, blog, { merge: true });

      setTitle("");
      setCategory("Category");
      setContent("");
      setFileList([]);
      setIsUpadtedBlog(false);
      setIsActive(false);
      updateSuccess();
      let a = document.getElementsByTagName("label");
      a[1].click();

      let cloneBlogs = [...allBlogs];
      cloneBlogs.splice(blogIndex, 1, { ...cloneBlogs[blogIndex], ...blog });
      setAllBlogs(cloneBlogs);
    } catch (error) {
      errorNotification();
      console.log(error);
    }
  }

  function deleteImageDb() {
    const imageRef = ref(storage, `blogimages/${imgName}`);
    deleteObject(imageRef)
      .then(() => {
        UploadImage();
      })
      .catch((error) => {
        console.log(error);
        errorNotification();
      });
  }

  async function deleteBlog(blogid: string, index: number, image: string) {
    console.log(image, blogid, index);

    const imageRef = ref(storage, `blogimages/${image}`);
    await deleteObject(imageRef)
      .then(() => {
        try {
          deleteDoc(doc(db, "blogs", blogid));
          deleteSuccess();
          let cloneBlogs = [...allBlogs];
          cloneBlogs.splice(index, 1);
          setAllBlogs(cloneBlogs);
        } catch (e) {
          console.log(e);
          errorNotification();
        }
      })
      .catch((error) => {
        console.log(error);
        errorNotification();
      });
  }

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      {contextHolder}
      <h2
        className="pl-10 pt-10"
        style={{
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        All Blogs
      </h2>
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          minHeight: "70vh",
        }}
        className="p-5"
      >
        {allBlogs.length == 0 && (
          <p
            style={{
              fontSize: "12px",
            }}
          >
            No Blog yet
          </p>
        )}

        {allBlogs.map((blog: DocumentData, index: number) => {
          return (
            <div
              className="card card-side bg-base-100 shadow-xl blog-card"
              style={{
                height: "fit-content",
              }}
              key={index}
            >
              <div className="card-body p-4 blog-card-content">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <h2
                    className="card-title"
                    style={{
                      width: "90%",
                    }}
                  >
                    {blog.title}
                  </h2>
                  <div
                    style={{
                      width: "10%",
                    }}
                  >
                    <div className="dropdown dropdown-end">
                      <img
                        tabIndex={0}
                        style={{
                          width: "25px",
                          marginLeft: "20px",
                          cursor: "pointer",
                        }}
                        src="https://static.thenounproject.com/png/1126660-200.png"
                        alt=""
                      />
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                      >
                        <label htmlFor="my_modal_6">
                          <li
                            onClick={() => {
                              setBlogIndex(index);
                              setValues(blog);
                              setblogID(blog.id);
                            }}
                          >
                            <a>Edit</a>
                          </li>
                        </label>
                        <li
                          onClick={() => {
                            setImgName(blog.imageName);
                           
                            deleteBlog(blog.id, index, blog.imageName);
                          }}
                        >
                          <a
                            style={{
                              color: "Red",
                            }}
                          >
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div
                  className="bg-primary"
                  style={{
                    margin: "5px 0",
                    border: "1px sloid black",
                    padding: "5px 15px",
                    width: "fit-content",
                    fontSize: "13px",
                    borderRadius: "20px",
                    color: "#e5e7eb",
                  }}
                >
                  {blog.category}
                </div>
                <p>{blog.content}</p>

                <div
                  className="card-actions"
                  style={{
                    justifyContent: "end",
                  }}
                >
                  <button
                    className="btn btn-primary read-blog-btn"
                    onClick={() => {
                      setIsloading(true);
                      route.push(`/blog/${blog.id}`);
                    }}
                  >
                    Read Blog &rarr;
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Open the modal using document.getElementById('ID').showModal() method */}

      <input type="checkbox" id="my_modal_6" className="modal-toggle" />

      <div className="modal" role="dialog">
        <div className="modal-box">
          {isUpdatedBlog ? (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "300px",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <span className="loading loading-spinner text-info  loading-lg"></span>
            </div>
          ) : (
            <div
              className=""
              style={{
                maxWidth: "600px",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                gap: "20px",
              }}
            >
              <Upload
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
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
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
            </div>
          )}

          <div className="modal-action">
            <label htmlFor="my_modal_6" className="btn">
              Cancel
            </label>
            <button
              disabled={isActive}
              className="btn btn-primary"
              onClick={() => {
                updateBlog();
              }}
            >
              {isActive ? "Uploading.." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
