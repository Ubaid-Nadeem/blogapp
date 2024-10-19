"use client";
import { useAuthContext } from "@/app/context/context";
import { getAuth, signOut } from "firebase/auth";

import { useEffect } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";
import logo from "../../../public/image.png";
export default function Navbar() {
  const { user, setUser,theme,setTheme } = useAuthContext()!;
  const route = useRouter();

  useEffect(() => {
    console.log(user?.photoURL);
  }, [user]);

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
    user && (
      <div className="navbar  bg-base-300">
        <div className="flex-1">
          <a
            className=" text-xl"
            onClick={() => {
              route.push("/");
            }}
          >
            <img
              style={{
                width: "50px",
                backgroundColor : "#ffff",
                padding:"5px",
                // height : "50px",
                borderRadius : "100%"
              }}
              src={'https://www.freeiconspng.com/thumbs/blogger-logo-icon-png/blogger-logo-icon-png-13.png'}
              alt=""
            />
          </a>
        </div>

        {user && (
          <div className="flex-none">
            {/* <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              ></div>
            </div>
             */}
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
                      "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg"
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
    )
  );
}
