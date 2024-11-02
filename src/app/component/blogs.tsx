"use client";

import { useEffect, useState } from "react";
import "./blog.css";
import { useAuthContext } from "../context/context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "../firebase/firebaseconfiq";
import { doc, getDoc } from "firebase/firestore";

export default function AllBlogs() {
  const { blogs } = useAuthContext()!;
  const [isloading, setIsloading] = useState(true);

  useEffect(() => {
    setIsloading(false);
  }, [blogs]);

  const route = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div
      className=""
      style={{
        display: "flex",
        gap: "15px",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {isloading ? (
        <span className="">Loading....</span>
      ) : (
        blogs.map((item, index) => {
          let cuurentDate = new Date();
          let blogDate = new Date(item.date.toDate().getTime());
          let a = blogDate.toDateString();
         
          return (
            <div
              className="card card-compact bg-base-100  shadow-xl blog-card bg-base-200 my-2 mb-5"
              key={index}
            >
              <div className="card-body">
                <h2
                  className="card-title"
                  style={{
                    fontSize: "18px",
                  }}
                >
                  {item.title}
                </h2>

                <div
                  className="bg-primary "
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
                  {item.category}
                </div>

                <p
                  className="blog-content"
                  style={{
                    fontSize: "14px",
                  }}
                >
                  {item.content}
                </p>
                <div className="card-actions justify-end">
                  <span
                    className="btn"
                    style={{
                      cursor: "pointer",
                      textAlign: "right",
                      // border: "1px solid blue",
                      padding: "10px",
                      // borderRadius: "20px",
                    }}
                    onClick={() => {
                      route.push(`/blog/${item.id}`);
                    }}
                  >
                    Read Blog &rarr;
                  </span>
                </div>
              </div>
              <Link href={`/u/${item.uid}`}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginTop: "10px",
                    flexDirection: "row",
                    padding: "15px",
                  }}
                  className="blog-card-username"
                >
                  <div className="avatar">
                    <div className="w-9 rounded-full">
                      <img
                        src={
                          item.profilePicture ||
                          "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                        }
                      />
                    </div>
                  </div>
                  <div className="ml-1">
                    <p
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {item.userName}
                    </p>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "GrayText",
                      }}
                    >
                      {a}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
}
