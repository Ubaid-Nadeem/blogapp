"use client";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { useAuthContext } from "../context/context";
import ProfileProtectedRoutes from "../HOC/profile-protected";

export default function Profile() {
  const auth = getAuth();
  const { user } = useAuthContext()!;

  useEffect(() => {
    // console.log(auth.currentUser);
  }, [user]);

  return (
    <ProfileProtectedRoutes>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",

          maxWidth: "400px",
          margin: "auto",
        }}
      >
        <img
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "100%",
          }}
          src={auth.currentUser?.photoURL || ""}
          alt=""
        />
        <h1
          style={{
            fontWeight: "bold",
            fontSize: "23px",
            marginTop: "15px",
          }}
        >
          {auth.currentUser?.displayName}
        </h1>
        <h2
          style={{
            fontSize: "13px",
          }}
        >
          {auth.currentUser?.email}
        </h2>

        <ul className="menu bg-base-200 rounded-box w-full mt-10">
          <li className="menu-title">Profile</li>
          <li>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              My Blogs
            </a>
          </li>
        </ul>

        <ul className="menu bg-base-200 rounded-box w-full mt-10">
          <li className="menu-title">Setting</li>
          <li>
            <a>Porfile Picture</a>
          </li>
          <li>
            <a>Name</a>
          </li>
          <li>
            <a>Email</a>
          </li>
          <li>
            <a>Password</a>
          </li>
        </ul>
      </div>
    </ProfileProtectedRoutes>
  );
}
