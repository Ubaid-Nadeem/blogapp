"use client";
import Fab from "@mui/material/Fab";
import AllBlogs from "./blogs";
import Carousel from "./carouse";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase/firebaseconfiq";
import { useAuthContext } from "../context/context";

export default function MainPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("Latest");
  const route = useRouter();
  const { setBlogs } = useAuthContext()!;

  useEffect(() => {
    setIsLoading(false);
    getBlogs();
  }, []);

  async function getBlogs() {
    let blogClone: any[] = [];
    let docRef = collection(db, "blogs");
    const q = query(docRef, orderBy("date", "desc"), limit(10));
    let data = await getDocs(q);

    data.forEach((doc) => {
      blogClone.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    setBlogs(blogClone);
  }

  async function filterBlog(Category: string) {
    setIsLoading(true);
    setFilterCategory(Category);
    let docRef = collection(db, "blogs");
    const q = query(docRef, where("category", "==", Category));
    let blogClone: DocumentData = [];
    try {
      let data = await getDocs(q);
      data.docs.forEach((blog) => {
        blogClone.push({ ...blog.data(), id: blog.id });
      });
    } catch (e) {
      console.log(e);
    }
    setBlogs(blogClone);
    setIsLoading(false);
  }

  return false ? (
    <Loading />
  ) : (
    <div
      style={{
        padding: "10px",
      }}
    >
      {/* action button */}
      <div
        style={{
          position: "fixed",
          bottom: "15px",
          right: "15px",
          zIndex: 1000,
        }}
        onClick={() => {
          setIsLoading(true);
          route.push("/newblog");
        }}
      >
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </div>
      <h2
        className=" ml-4 mt-4 mb-2 "
        style={{ color: "#969ca0", fontSize: "20px" }}
      >
        Your Daily
      </h2>
      <h1 className="text-2xl font-bold m-4 mt-0">Recommendation</h1>
      <Carousel />
      <div className="p-3">
        <select
          className="select select-bordered w-full max-w-xs"
          onChange={(e) => {
            filterBlog(e.target.value);
          }}
        >
          <option disabled selected>
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
      </div>
      <h2 className="text-2xl font-bold   m-4">{filterCategory}</h2>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "200px",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <span className="loading loading-dots loading-md"></span>
        </div>
      ) : (
        <AllBlogs />
      )}{" "}
    </div>
  );
}
