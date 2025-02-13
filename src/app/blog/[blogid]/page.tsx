"use client";

import Loading from "@/app/component/loading";
import { auth, db } from "@/app/firebase/firebaseconfiq";
import { doc, DocumentData, getDoc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./style.css";
import Link from "next/link";
import { Button, Divider, notification, Space } from "antd";
import type { NotificationArgsProps } from "antd";

type NotificationPlacement = NotificationArgsProps["placement"];

export default function BlogDetails({ params }: any) {
  const [isloading, setIsloading] = useState(true);
  const [blog, setBlog] = useState<DocumentData | undefined>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [textURL, setTextURL] = useState("");
  const [blogDate, setBlogDate] = useState("");
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    getBlog();
  }, []);

  const openNotification = () => {
    api.error({
      message: `Authentication`,
      description: "You are not authenticated!",
      placement : "top"
    });
  };

  async function getBlog() {
    console.log( params.blogid)
    let docRef = doc(db, "blogs", params.blogid);
    try {
      let blog = await getDoc(docRef);

      likeFeature(blog.data()?.likes);

      if (blog.data()) {
        let blogDate = new Date(blog.data()?.date.toDate().getTime());
        let a = blogDate.toDateString();

        setBlogDate(a);
      }
      setBlog({ ...blog.data(), id: blog.id });
      setIsloading(false);
    } catch (e) {
      console.log(e);
    }
  }

  function copyURL() {
    navigator.clipboard.writeText(textURL);
    setIsCopied(true);
  }
  function getURL() {
    setTextURL(location.href);
  }

  function likeFeature(likes: any) {
    if (likes.indexOf(auth.currentUser?.uid)) {
      setIsFavorite(false);
    } else {
      setIsFavorite(true);
    }
  }

  async function toogleLike() {
    if (auth.currentUser) {
      setIsFavorite(!isFavorite);
      let blogClone = blog;

      if (!isFavorite) {
        blogClone?.likes.push(auth.currentUser?.uid);

        setBlog(blogClone);
      } else {
        blogClone?.likes.splice(
          blogClone?.likes.indexOf(auth.currentUser?.uid),
          1
        );

        setBlog(blogClone);
      }
      console.log(blog?.id);
      let docRef = doc(db, "blogs", blog?.id);

      await setDoc(docRef, { likes: blog?.likes }, { merge: true });
    } else {
      openNotification()
    }
  }

  return (
    <div>
      {contextHolder}
      {isloading ? (
        <Loading />
      ) : blog == undefined ? (
        <div
          style={{
            height: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "14px",
            }}
          >
            This Content is not available
          </p>
        </div>
      ) : (
        <div
          className="p-6"
          style={{
            maxWidth: "600px",
            margin: "auto",
          }}
        >
          {" "}
          <div
            className="mb-5 "
            style={{
              display: "flex",
              alignItems: "center",
              // borderBottom: "1px solid",
              // paddingBottom: "20px",
              borderRadius: "5px",
            }}
          >
            <img
              src={blog?.profilePicture}
              alt=""
              style={{
                borderRadius: "100%",
                width: "30px",
                height: "30px",
              }}
            />
            <div>
              <Link href={`/u/${blog?.uid}`}>
                <p
                  style={{
                    fontWeight: "bold",
                    marginLeft: "10px",
                    fontSize: "14px",
                  }}
                >
                  {blog?.userName}
                </p>
              </Link>
              <p
                className="ml-3"
                style={{
                  color: "gray",
                  fontSize: "11px",
                }}
              >
                {blogDate}
              </p>
            </div>
          </div>
          <img
            src={blog?.imageURL}
            alt=""
            className="blogImage"
            style={{
              width: "300px",
              borderRadius: "10px",
              margin: "auto",
            }}
          />
          <h1
            className="text-2xl text-bold"
            style={{
              margin: "20px 0",
              fontWeight: "bold",
            }}
          >
            {blog?.title}
          </h1>
          <div className="badge badge-neutral p-4 mb-5">{blog?.category}</div>
          <div
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {blog?.content}
          </div>
          <button className="btn mt-5" onClick={toogleLike}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 like"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{
                fill: isFavorite ? "red" : "",
                stroke: isFavorite ? "red" : "",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <div className="badge">{blog.likes.length}</div>
          </button>
          <label htmlFor="my_modal_6" className="btn ml-2" onClick={getURL}>
            <img
              style={{
                width: "22px",
              }}
              src="https://pngimg.com/uploads/share/share_PNG16.png"
              alt=""
            />
          </label>
        </div>
      )}

      <input type="checkbox" id="my_modal_6" className="modal-toggle" />

      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            URL
            <img
              style={{
                width: "25px",
                display: "inline",
              }}
              src="https://static.vecteezy.com/system/resources/previews/015/152/952/non_2x/url-icon-design-for-web-interfaces-and-applications-png.png"
              alt=""
            />
          </h3>

          <input
            type="text"
            placeholder={textURL}
            className="input input-bordered mt-5 copy-text-feild"
            disabled
          />
          <button
            className="btn btn-primary copy-btn "
            style={{
              display: "inline",
            }}
            onClick={copyURL}
          >
            {isCopied ? "Copied!" : "Copy"}
          </button>

          <div className="modal-action">
            <label htmlFor="my_modal_6" className="btn">
              Close!
            </label>
          </div>
        </div>
      </div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
    
    </div>
  );
}
