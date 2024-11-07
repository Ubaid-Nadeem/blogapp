"use client";
import Image from "next/image";
import logo from "../../../public/bloggerlogo.png";
import { auth } from "../firebase/firebaseconfiq";
import { getAuth, sendEmailVerification, signOut } from "firebase/auth";
import { Button, Result, message, Space } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/context";
import Loading from "../component/loading";

export default function VerifyEmail() {
  const [messageApi, contextHolder] = message.useMessage();
  const [showTimer, setShowTimer] = useState<string | number>(30);
  const [sendAgainBtn, setSendAgainBtn] = useState(false);
  const [isloading, setIsloading] = useState(true);
  const route = useRouter();
  const { user, setUser } = useAuthContext()!;

  useEffect(() => {
    console.log(user)
    if (user && auth.currentUser?.emailVerified) {
      //   let userClone = { ...user, isVerified: true };
      //   setUser(userClone);
      route.push("/");
    } else if (user && !auth.currentUser?.emailVerified) {
      setIsloading(false);
    }
  }, [user]);

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Email sent successfully",
    });
  };

  function emailVerification() {
    if (auth.currentUser) {
      sendEmailVerification(auth.currentUser).then(() => {
        setSendAgainBtn(true);
        verificationTimer();
        success();
      });
    }
  }

  function verificationTimer() {
    let count = 30;
    let timer = setInterval(() => {
      count = count - 1;
      setShowTimer(count);
      if (count < 10) {
        setShowTimer("0" + count);
      }
      if (count == 0) {
        clearInterval(timer);
        setSendAgainBtn(false);
      }
    }, 1000);
  }

  return isloading ? (
    <Loading />
  ) : (
    <div>
      {contextHolder}
      <div
        className="bg-base-200"
        style={{
          width: "90%",
          maxWidth: "600px",
          margin: "auto",
          textAlign: "center",
          height: "420px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            margin: "20px auto",
            fontSize: "18px",
            fontWeight: "bold",
            // marginRight : "10px"
          }}
        >
          <Image
            className="bg-base-100"
            src={logo}
            alt="logo"
            style={{
              width: "50px",
              padding: "5px",
              //   backgroundColor : "white",
              borderRadius: "100%",
              marginRight: "5px",
            }}
          />
          Blogger
        </div>
        <h1
          style={{
            fontWeight: "bold",
            fontSize: "22px",
            padding: "10px",
          }}
        >
          Verify your email address
        </h1>
        {/* <p style={{
            color : "GrayText"
        }}>ubaid@gmail.com</p> */}
        <p
          style={{
            width: "80%",
            color: "GrayText",
            fontSize: "13px",
            padding: "15px",
            margin: "0 auto",
          }}
        >
          Please confirm that you want to use this as your Blogger account email
          addres. Once its done you will be able to start Blogging
        </p>
        <button
          disabled={sendAgainBtn}
          className="btn btn-primary"
          style={{
            margin: "auto",
            width: "80%",
            marginTop: "20px",
            marginBottom: "30px",
          }}
          onClick={emailVerification}
        >
          Verify Email
        </button>
        <p
          key={1}
          style={{
            color: "GrayText",
            fontSize: "14px",
          }}
        >
          {" "}
          00 : {showTimer}
        </p>
      </div>
    </div>
  );
}
