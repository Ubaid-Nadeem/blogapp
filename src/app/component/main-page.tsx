"use client";
import Fab from "@mui/material/Fab";
import AllBlogs from "./blogs";
import Carousel from "./carouse";
import AddIcon from "@mui/icons-material/Add";

export default function MainPage() {
  return (
    <>
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
        >
          <Fab color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </div>

        {/* form */}

        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Press ESC key or click on ✕ button to close</p>
          </div>
        </dialog>

        <h2
          className=" ml-4 mt-4 mb-2 "
          style={{ color: "#969ca0", fontSize: "20px" }}
        >
          Your Daily
        </h2>
        <h1 className="text-2xl font-bold m-4 mt-0">Recommendation</h1>
        <Carousel />
      
          <div className="dropdown dropdown-hover  dropdown-right mt-5">
            <div tabIndex={0} role="button" className="btn m-1">
             Filter Category
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
             
              <li>
                <a>Movies</a>
              </li>
              <li>
                <a>Codding</a>
              </li>
            </ul>
          </div>
       
        <h2 className="text-2xl font-bold   m-4">Trending</h2>
        <AllBlogs />
      </div>
    </>
  );
}
