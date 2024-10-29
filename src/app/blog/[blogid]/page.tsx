"use client";

import Loading from "@/app/component/loading";
import { db } from "@/app/firebase/firebaseconfiq";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./style.css";

export default function BlogDetails({ params }: any) {
  const [isloading, setIsloading] = useState(true);
  const [blog, setBlog] = useState<DocumentData | undefined>();
  const [isFavorite, setIsFavorite] = useState(true);
  

  useEffect(() => {
    getBlog();
  }, []);

  async function getBlog() {
    let docRef = doc(db, "blogs", params.blogid);
    try {
      let blog = await getDoc(docRef);
      console.log(blog.data());
      setBlog(blog.data());
      setIsloading(false);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      {isloading ? (
        <Loading />
      ) : (
        <div className="p-6">
          {" "}
          <div
            className="mb-5 p-2  bg-base-300"
            style={{
              display: "flex",
              alignItems: "center",
             
            }}
          >
            <img
              src={blog?.profilePicture}
              alt=""
              style={{
                borderRadius: "100%",
                width: "50px",
                height: "50px",
              }}
            />
            <p
              style={{
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            >
              {blog?.userName}
            </p>
          </div>
          <img src={blog?.imageURL} alt="" className="blogImage" style={{
            width : "300px"
          }}/>
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
          <p>{blog?.content}</p>
          <button className="btn mt-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 "
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
            <div className="badge">0</div>
          </button>
        </div>
      )}
    </div>
  );
}
