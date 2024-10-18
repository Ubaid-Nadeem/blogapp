"use client";
import { useAuthContext } from "@/app/context/context";
import { getAuth, signOut } from "firebase/auth";

import { useEffect } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, setUser } = useAuthContext()!;
  const route = useRouter();

  useEffect(() => {}, [user]);

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

  return (
  user && <div className="navbar  bg-base-300">
      <div className="flex-1">
        <a
          className="btn btn-ghost text-xl"
          onClick={() => {
            route.push("/");
          }}
        >
          blogApp
        </a>
      </div>

      {user && (
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.516 3c2.382 0 4.487 1.564 4.487 4.712 0 4.963-6.528 8.297-10.003 11.935-3.475-3.638-10.002-6.971-10.002-11.934 0-3.055 2.008-4.713 4.487-4.713 3.18 0 4.846 3.644 5.515 5.312.667-1.666 2.333-5.312 5.516-5.312zm0-2c-2.174 0-4.346 1.062-5.516 3.419-1.17-2.357-3.342-3.419-5.515-3.419-3.403 0-6.484 2.39-6.484 6.689 0 7.27 9.903 10.938 11.999 15.311 2.096-4.373 12-8.041 12-15.311 0-4.586-3.414-6.689-6.484-6.689z" />
                </svg>
                <span className="badge badge-sm indicator-item">0</span>
              </div>
            </div>
            {/* <div
              tabIndex={0}
              className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
            >
              <div className="card-body">
                <span className="text-lg font-bold">8 Items</span>
                <span className="text-info">Subtotal: $999</span>
                <div className="card-actions">
                  <button className="btn btn-primary btn-block">
                    View cart
                  </button>
                </div>
              </div>
            </div> */}
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={
                    user.photoURL
                      ? user?.photoURL
                      : "https://static.thenounproject.com/png/65476-200.png"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li
                onClick={() => {
                  logOut();
                  console.log("logout");
                }}
              >
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
