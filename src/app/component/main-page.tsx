"use client";
import Fab from "@mui/material/Fab";
import AllBlogs from "./blogs";
import Carousel from "./carouse";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";

export default function MainPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const route = useRouter();

  return isLoading ? (
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

      {/* form */}

      {/* <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
           
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click on ✕ button to close</p>
        </div>
      </dialog> */}

      <h2
        className=" ml-4 mt-4 mb-2 "
        style={{ color: "#969ca0", fontSize: "20px" }}
      >
        Your Daily
      </h2>
      <h1 className="text-2xl font-bold m-4 mt-0">Recommendation</h1>
      <Carousel />

      <div className="p-3">
        <select className="select select-bordered w-full max-w-xs">
          <option disabled selected>
           Select Category
          </option>
          <option>Han Solo</option>
          <option>Greedo</option>
        </select>
      </div>

      <h2 className="text-2xl font-bold   m-4">Trending</h2>
      <AllBlogs />
    </div>
  );
}
