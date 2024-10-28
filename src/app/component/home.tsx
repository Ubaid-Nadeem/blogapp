"use client";
import "./home.css";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseconfiq";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/context";
import { useEffect, useState } from "react";
import Loading from "./loading";

export default function HomeComponent() {
  const provider = new GoogleAuthProvider();
  const route = useRouter();
  const [isLoading, setIsloading] = useState(true);

  const { setUser } = useAuthContext()!;

  useEffect(() => {
    setIsloading(false);
  }, []);

  

  return isLoading ? (
    <Loading />
  ) : (
    <div className="home-container text-neutral-content">
      <div className="home-cover">
        <h2 className="subHeading text-2xl mt-20">Everyday New</h2>
        <h1 className="text-3xl mt-5 font-bold">Personal Blog</h1>
        <div className="footer-btn">
          <button
            className="btn btn-primary"
            onClick={() => {
              setIsloading(true);
              route.push("/login");
            }}
          >
            SIGN IN
          </button>
        
        </div>
      </div>
    </div>
  );
}
