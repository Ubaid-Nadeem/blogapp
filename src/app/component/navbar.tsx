"use client";
import { useAuthContext } from "@/app/context/context";
import { getAuth, signOut } from "firebase/auth";

import { useEffect } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";
import logo from "../../../public/image.png";
import Bloggerlogo from "../../../public/bloggerlogo.png";
import Image from "next/image";
import { auth } from "../firebase/firebaseconfiq";
import { Button, Modal, Space } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";

export default function Navbar({ isDarkTheme }: any) {
  const { user, setUser, theme, setTheme } = useAuthContext()!;
  const route = useRouter();
  const { confirm } = Modal;

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

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure you want to log out?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        logOut();
      },
      onCancel() {},
    });
  };

  return (
    <div
      className="navbar  bg-base-300"
      style={{
        padding: "0 20px",
      }}
    >
      <div className="flex-1">
        <a
          style={{
            cursor: "pointer",
          }}
          className=" text-xl"
          onClick={() => {
            route.push("/");
          }}
        >
          <Image
            style={{
              width: "40px",
              backgroundColor: "#ffff",
              padding: "5px",
              // height : "50px",
              borderRadius: "100%",
            }}
            src={Bloggerlogo}
            alt=""
          />
        </a>
      </div>

      {
        <div className="flex-none">
          {user ? (
            <div className="dropdown dropdown-end ml-5">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={auth.currentUser?.photoURL || ""}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <div
                    className="form-control flex "
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <p>Dark Mode</p>
                    <input
                      type="checkbox"
                      value="dark"
                      className="toggle theme-controller"
                    />
                  </div>
                </li>
                <li>
                  <a
                    className="justify-between"
                    onClick={() => {
                      route.push("/profile");
                    }}
                  >
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li
                  onClick={() => {
                    showDeleteConfirm();
                  }}
                >
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          ) : (
            <Link href={"/login"}>
            <button className="btn  btn-neutral" >Login</button>
            </Link>
          )}
        </div>
      }
    </div>
  );
}
