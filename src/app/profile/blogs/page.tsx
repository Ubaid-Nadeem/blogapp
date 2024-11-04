"use client";

import { useAuthContext } from "@/app/context/context";
import { auth, db } from "@/app/firebase/firebaseconfiq";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import Loading from "@/app/component/loading";

export default function MyBlogs() {
  const { user, setUser } = useAuthContext()!;
  const [allBlogs, setAllBlogs] = useState<DocumentData | []>([]);
  const [isLoading, setIsloading] = useState(true);

  const route = useRouter();

  useEffect(() => {
    getBlogs();
  }, [user]);

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

  return isLoading ? (
    <Loading />
  ) : (
    <>
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
        {allBlogs.map((blog: DocumentData, index: string) => {
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
                        <li>
                          <a>Edit</a>
                        </li>
                        <li>
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
    </>
  );
}
