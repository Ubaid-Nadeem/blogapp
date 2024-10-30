"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import "../globals.css";
import Loading from "./loading";
import { useAuthContext } from "../context/context";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseconfiq";
import { useRouter } from "next/navigation";

export default function AuthComponent({ authType }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsloading] = useState(true);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const { setUser } = useAuthContext()!;
  const route = useRouter();

  
  const errors = [
    {
      firebaseError: "Firebase: Error (auth/invalid-email).",
      userError: "Invalid email",
    },
    {
      firebaseError: "Firebase: Error (auth/email-already-in-use).",
      userError: "email already in use",
    },
    {
      firebaseError:
        "Firebase: Password should be at least 6 characters (auth/weak-password).",
      userError: "Weak password (Password should be at least 6 characters)",
    },
    {
      firebaseError: "Firebase: Error (auth/network-request-failed).",
      userError: "Network error",
    },
    {
      firebaseError: "Firebase: Error (auth/invalid-credential).",
      userError: "Wrong email or password",
    },
  ];

  useEffect(() => {
    setIsloading(false);
  }, []);

  function loginUser() {
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          route.push("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          let [sortError] = errors.filter(
            (err) => err.firebaseError == errorMessage
          );

          setErrorMsg(sortError.userError);
          setError(true);
        });
    } else {
      setError(true);
      setErrorMsg("please fill all values");
    }
  }

  function signUpUser() {
    if (email && password && name) {
      SignUpWithGmailAndPassword(email, password, name);
    } else {
      setError(true);
      setErrorMsg("please fill all values");
    }
  }

  function checkError() {
    if (authType == "login" && email && password) {
      setError(false);
      setErrorMsg("");
    } else if (authType == "signup" && email && password && name) {
      setError(false);
      setErrorMsg("");
    }
  }

  //  function googleLogin() {
  //     signInWithPopup(auth, provider)
  //       .then((result) => {
  //         let newUser = result.user;
  //         let obj = {
  //           name: newUser.displayName,
  //           email: newUser.email,
  //           uid: newUser.uid,
  //           photoURL: newUser.photoURL,
  //           isVerified: newUser.emailVerified,
  //         };

  //         let docRef = doc(db, "users", result.user.uid);
  //         checkingUserInDb(docRef, result.user);
  //       })
  //       .catch((error) => {
  //         const errorCode = error.code;
  //         const errorMessage = error.message;
  //         console.log(errorMessage);
  //       });
  //   }

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

  // async function checkingUserInDb(docRef: any, user: any) {
  //   let currentUser = await getDoc(docRef);

  //   if (!currentUser.data()) {
  //     createUser(user, user.displayName);
  //   }
  // }

  function SignUpWithGmailAndPassword(
    email: string,
    password: string,
    name: string
  ) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user,name)
        createUser(user, name);

        updateProfile(auth.currentUser!, {
          displayName: name, 
          photoURL: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",

        }).then(() => {
          // Profile updated!
          // ...
        }).catch((error) => {
          // An error occurred
          // ...
        });

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        let [sortError] = errors.filter(
          (err) => err.firebaseError == errorMessage
        );

        setErrorMsg(sortError.userError);
        setError(true);
      });
  }

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

  async function checkingUserInDb(docRef: any, user: any) {
    let currentUser = await getDoc(docRef);

    if (!currentUser.data()) {
      createUser(user, user.displayName);
    }
  }

  return isLoading ? (
    <Loading />
  ) : (
    <div className="signup-container">
      <h1 className="text-center sign-heading">
        {authType == "signup" ? "Create an account" : "Welcome Back"}
      </h1>
      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
          <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
        </svg>
        <input
          type="text"
          className="grow"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            checkError();
          }}
        />
      </label>
      {authType == "signup" ? (
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Username"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              checkError();
            }}
          />
        </label>
      ) : (
        <></>
      )}
      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="password"
          className="grow"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            checkError();
          }}
        />
      </label>

      {error && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-2 w-2 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 25 25"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {authType == "signup" ? (
        <button className="btn btn-primary" onClick={signUpUser}>
          Sign up
        </button>
      ) : (
        <button className="btn btn-primary" onClick={loginUser}>
          Log in
        </button>
      )}

      <button className="btn btn-accent" onClick={googleLogin}>
        <img
          src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
          style={{
            width: "20px",
            height: "20px",
          }}
          alt=""
        />
        Continoue with Google
      </button>

      {authType != "signup" ? (
        <p className="text-center">
          Does have not an account?{" "}
          <Link
            onClick={() => {
              setIsloading(true);
            }}
            href={"/signup"}
          >
            Signup here.
          </Link>
        </p>
      ) : (
        <p
          className="text-center"
          onClick={() => {
            setIsloading(true);
          }}
        >
          Already have an account? <Link href={"/login"}>Login here.</Link>
        </p>
      )}
    </div>
  );
}
