"use client";
import Image from "next/image";
import logo from "../../../public/bg3.webp"
import "./home.css"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseconfiq";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/context";

export default function HomeComponent() {

  const provider = new GoogleAuthProvider();
  const route = useRouter();
  const { user, setUser } = useAuthContext()!;



  function googleLogin() {
    signInWithPopup(auth, provider)
      .then((result) => {
        let newUser = result.user;
        let obj = {
          name: newUser.displayName,
          email: newUser.email,
          uid: newUser.uid,
          photoURL: newUser.photoURL,
          isVerified: newUser.emailVerified,
        };

        let docRef = doc(db, "users", result.user.uid);
        checkingUserInDb(docRef, result.user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }

  async function createUser(user: any, name: string) {
    try {
      let obj = {
        uid: user.uid,
        email: user.email,
        name: name,
        isVerified: user.emailVerified,
        photoURL: user.photoURL,
      };
      await setDoc(doc(db, "users", user.uid), obj);
      localStorage.setItem("loggedIn", JSON.stringify(obj));
      setUser(obj);
      route.push("/");
    } catch (e) {
      console.log(e);
    }
  }

  async function checkingUserInDb(docRef: any, user: any) {
    let currentUser = await getDoc(docRef);

    if (!currentUser.data()) {
      createUser(user, user.displayName);
    }
  }





  return (
    <div className="home-container text-neutral-content">
      <div className="home-cover">
        <h2 className="subHeading text-3xl mt-20">Everyday New</h2>
        <h1 className="text-5xl mt-5 font-bold">Personal Blog</h1>
     <div className="footer-btn">
     <button className="btn btn-primary" onClick={()=>{
      route.push("/login")
     }}>SIGN IN</button>
      <button className="btn  btn-accent" onClick={googleLogin}>CONTINOUE WITH GOOGLE</button>
     </div>
      </div>
    </div>
  );
}
