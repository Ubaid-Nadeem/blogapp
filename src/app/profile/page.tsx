"use client";
import {
  getAuth,
  GoogleAuthProvider,
  signOut,
  updatePassword,
  updateProfile,
  reauthenticateWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/context";
import ProfileProtectedRoutes from "../HOC/profile-protected";
import { Modal } from "antd";
import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps, FormProps } from "antd";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Image, Upload } from "antd";
import { UserType } from "@/app/types/usertype";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { notification } from "antd";

import type { NotificationArgsProps } from "antd";
import { db } from "../firebase/firebaseconfiq";
import firebase from "firebase/compat/app";
import Loading from "../component/loading";
import Link from "next/link";
type NotificationPlacement = NotificationArgsProps["placement"];

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function Profile() {
  const auth = getAuth();
  const { user, setUser } = useAuthContext()!;
  const [api, contextHolder] = notification.useNotification();

  const { confirm } = Modal;
  const storage = getStorage();

  const [updateType, setUpdateType] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isDisableBtn, setIsDisableBtn] = useState(true);
  const [name, setName] = useState<string | undefined>();
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    setIsloading(false);
  }, [user]);

  async function updateAuthProfileURL(url: string) {
    updateProfile(auth.currentUser!, {
      photoURL: url,
    })
      .then(() => {
        updateURLDb(url);
        let CloneUser = { ...user };
        CloneUser.photoURL = url;
        setUser({ ...CloneUser } as UserType);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function updateURLDb(url: string) {
    if (user) {
      let docRef = doc(db, "users", user.uid);
      const q = query(
        collection(db, "blogs"),
        where("uid", "==", auth.currentUser?.uid)
      );

      let BlogSnapShot = await getDocs(q);
      BlogSnapShot.docs.forEach((blog) => {
        updateBlog(blog.id, url);
      });

      await setDoc(docRef, {
        ...user,
        photoURL: url,
      });

      uploadedPicture("top");
    }
  }

  async function updateBlog(id: string, url: string) {
    let blogRef = doc(db, "blogs", id);
    await setDoc(blogRef, { profilePicture: url }, { merge: true });
  }

  const openNotification = (placement: NotificationPlacement) => {
    api.info({
      message: ``,
      description: "Updating please wait..",
      placement,
    });
  };

  const uploadedPicture = (placement: NotificationPlacement) => {
    api.success({
      message: ``,
      description: "Update successful",
      placement,
    });
  };

  function logOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setUser(null);
        localStorage.removeItem("loggedIn");
      })
      .catch((error) => {
        // An error happened.
      });
  }

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure you want to log out?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        logOut();
      },
      onCancel() {},
    });
  };

  function getUpdateMethod(method: string) {
    setUpdateType(method);
  }

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList[0]) {
      setIsDisableBtn(false);
    } else {
      setIsDisableBtn(true);
    }
  };

  function UploadImage() {
    openNotification("top");
    let extension = fileList[0]?.name.split(".")[1];
    let uuid = crypto.randomUUID();
    let file = fileList[0].originFileObj;
    let PhotoRef = `${uuid}.${extension}`;

    const storageRef = ref(storage, `profiles/${PhotoRef}`);

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
          console.log(downloadURL);
          updateAuthProfileURL(downloadURL);
          // SaveBlogDB(downloadURL);

          setFileList([]);
          setTimeout(() => {
            setIsDisableBtn(true);
          }, 1000);
        });
      }
    );
  }

  async function updateName() {
    openNotification("top");
    updateProfile(auth.currentUser!, {
      displayName: name,
    })
      .then(() => {
        updateNameDb();
        let CloneUser = { ...user };
        CloneUser.name = name;
        setUser({ ...CloneUser } as UserType);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function updateNameDb() {
    if (user) {
      let docRef = doc(db, "users", user.uid);
      const q = query(
        collection(db, "blogs"),
        where("uid", "==", auth.currentUser?.uid)
      );

      let BlogSnapShot = await getDocs(q);
      BlogSnapShot.docs.forEach((blog) => {
        updateNameInBlog(blog.id, name as string);
      });

      await setDoc(docRef, {
        ...user,
        name: name,
      });

      uploadedPicture("top");
    }
  }

  async function updateNameInBlog(id: string, url: string) {
    let blogRef = doc(db, "blogs", id);
    await setDoc(blogRef, { userName: name }, { merge: true });
  }

  async function updatePasswordAuth() {
    openNotification("top");
    console.log(auth);
    if (auth.currentUser) {
      updatePassword(auth.currentUser, password)
        .then(() => {
          uploadedPicture("top");
          setPassword("");
        })
        .catch((error) => {
          let userData = reauthWithGoogle();
          console.log(userData);
        });
    }
  }

  async function updateValue() {
    if (updateType == "profilePicture") {
      UploadImage();
    } else if (updateType == "name") {
      updateName();
    } else if (updateType == "password") {
      updatePasswordAuth();
    }
  }

  const handleNameChange = (name: any) => {
    if (name) {
      setIsDisableBtn(false);
    } else {
      setIsDisableBtn(true);
    }
  };

  const handlePasswordChange = (password: any) => {
    if (password.length >= 6) {
      setIsDisableBtn(false);
    } else {
      setIsDisableBtn(true);
    }
  };

  function reauthWithGoogle() {
    const googleProvider = new GoogleAuthProvider();
    if (auth.currentUser) {
      return reauthenticateWithPopup(auth.currentUser, googleProvider);
    }
  }

  return isLoading ? (
    <Loading />
  ) : (
    <>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",

          maxWidth: "400px",
          margin: "auto",
        }}
      >
        <img
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "100%",
          }}
          src={
            auth.currentUser?.photoURL ||
            "https://cdn-icons-png.flaticon.com/512/9385/9385289.png"
          }
          alt=""
        />
        <h1
          style={{
            fontWeight: "bold",
            fontSize: "23px",
            marginTop: "15px",
          }}
        >
          {auth.currentUser?.displayName}
        </h1>
        <h2
          style={{
            fontSize: "13px",
          }}
        >
          {auth.currentUser?.email}
        </h2>

        <ul className="menu bg-base-200 rounded-box w-full mt-10">
          <li className="menu-title">Profile</li>
          <Link href="profile/blogs">
            <li>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                My Blogs
              </a>
            </li>
          </Link>
        </ul>

        <ul className="menu bg-base-200 rounded-box w-full mt-10">
          <li className="menu-title">Setting</li>
          <label htmlFor="my_modal_6">
            <li
              onClick={() => {
                getUpdateMethod("profilePicture");
              }}
            >
              <a>Porfile Picture</a>
            </li>
          </label>
          <label htmlFor="my_modal_6">
            <li
              onClick={() => {
                getUpdateMethod("name");
              }}
            >
              <a>Name</a>
            </li>
          </label>
          {/* <label htmlFor="my_modal_6">
            <li
              onClick={() => {
                getUpdateMethod("email");
              }}
            >
              <a>Email</a>
            </li>
          </label> */}
          <label htmlFor="my_modal_6">
            <li
              onClick={() => {
                getUpdateMethod("password");
              }}
            >
              <a>Password</a>
            </li>
          </label>

          <li
            style={{
              color: "red",
            }}
            onClick={showDeleteConfirm}
          >
            <a>Log out</a>
          </li>
        </ul>

        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <input type="checkbox" id="my_modal_6" className="modal-toggle" />
        <div className="modal" role="dialog">
          <div className="modal-box">
            {updateType == "profilePicture" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h2 className="font-bold text-xl m-3">
                  Choose Profile Picture
                </h2>
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
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
              </div>
            )}

            {updateType == "name" && (
              <div>
                <h2 className="font-bold text-xl m-3">New Name</h2>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    handleNameChange(e.target.value);
                  }}
                />
              </div>
            )}

            {updateType == "password" && (
              <div>
                <h2 className="font-bold text-xl m-3">New Password</h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "gray",
                    marginBottom: "15px",
                    marginLeft: "10px",
                  }}
                >
                  Note : Password should be at least 6 characters
                </p>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handlePasswordChange(e.target.value);
                  }}
                />
              </div>
            )}

            <div className="modal-action">
              <label
                htmlFor="my_modal_6"
                className="btn"
                onClick={() => {
                  setName("");
                  setPassword("");
                  setFileList([]);
                  setIsDisableBtn(true);
                }}
              >
                Close
              </label>
              {!isDisableBtn && (
                <label
                  htmlFor="my_modal_6"
                  className="btn btn-primary"
                  onClick={() => {
                    updateValue();
                  }}
                >
                  Save
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
