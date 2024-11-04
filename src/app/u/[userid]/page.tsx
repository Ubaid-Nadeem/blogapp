"use client";

import "./style.css";
import { db } from "@/app/firebase/firebaseconfiq";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/component/loading";

type userType = {
  email: string;
  isVerified: boolean;
  name: string;
  photoURL: null | string;
  uid: string;
};

export default function User({ params: { userid } }: any) {
  const [blogs, setBlogs] = useState<DocumentData>([]);
  const [user, setUser] = useState<DocumentData>();
  const [isLoading, setIsloading] = useState(true);
  const route = useRouter();

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    let blogClone: any = [];
    const ref = doc(db, "users", userid);
    const blogRef = collection(db, "blogs");
    const q = query(blogRef, where("uid", "==", userid));

    const userSnapShot = await getDoc(ref);
    try {
      const blogsSnapShot = await getDocs(q);
      blogsSnapShot.docs.forEach((doc) => {
        let blog = doc.data();
        blog.id = doc.id;
        blogClone.push(blog);
      });
      setIsloading(false);
    } catch (e) {}

    let userData = userSnapShot.data();
    setUser({ ...userData });
    setBlogs([...blogClone]);
  
  }

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      {user && (
        <div
          className="p-5"
          style={{
            margin: "10px auto",
          }}
        >
          <div
            className="bg-base-200 p-4"
            style={{
              borderRadius: "10px",
            }}
          >
            <div
              className="user-card"
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "250px",
                alignItems: "center",
              }}
            >
              <img
                style={{
                  width: "100px",
                  height : "100px",
                  padding: "5px",
                  border: "5px solid #e5e7eb",
                  borderRadius: "100%",
                }}
                src={
                  user.photoURL ||
                  "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                }
                alt=""
              />
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginTop: "10px",
                }}
              >
                {user.name}
              </p>

              <p
                style={{
                  fontSize: "12px",
                }}
              >
                {blogs.length} blog
              </p>
            </div>
          </div>
        </div>
      )}

      <h1
        className="pl-6"
        style={{
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        Blogs{" "}
      </h1>

      <div className="blog-card-container p-5">
        {blogs.map((blog: DocumentData, index: number) => {
          let BlogData = blog;
          return (
              <div
                className="card card-side bg-base-100 shadow-xl blog-card"
                key={index}
              >
                <div className="card-body p-4 blog-card-content">
                  <h2 className="card-title ">{BlogData.title}</h2>

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
                    {"Sports"}
                  </div>
                  <p>{BlogData.content}</p>

                  <div
                    className="card-actions"
                    style={{
                      justifyContent: "end",
                    }}
                  >
                    <button
                      className="btn"
                      //   onClick={() => {
                      //     setIsFavorite(!isFavorite);
                      //   }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 "
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={
                          {
                            //   fill: isFavorite ? "red" : "",
                            //   stroke: isFavorite ? "red" : "black",
                          }
                        }
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <button
                      className="btn btn-primary read-blog-btn"
                      onClick={() => {
                       
                        route.push(`/blog/${BlogData.id}`);
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
    </div>
  );
}
