"use client";

import { getAuth, updateProfile } from "firebase/auth";
import { useAuthContext } from "../context/context";
import { ReactNode, useEffect, useState } from "react";
import Loading from "../component/loading";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseconfiq";

type HomeProtectedRoutesTypes = {
  children: ReactNode;
};

export default function HomeProtectedRoutes({
  children,
}: HomeProtectedRoutesTypes) {
  const { user, setUser } = useAuthContext()!;
  const [isLoading, setIsloading] = useState(true);
  const route = useRouter();
  const auth = getAuth();

  useEffect(() => {
    let activeUser = localStorage.getItem("loggedIn");

    if (activeUser) {
      let formateData = JSON.parse(activeUser);

      if (formateData.name == null) {
        getUser();
      } else {
        setIsloading(false);
      }
    } else {
      setIsloading(false);
    }
  }, [user]);

  async function getUser() {
    console.log("run");
    const docRef = doc(db, "users", auth.currentUser?.uid as string);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && auth) {
      updateProfile(auth.currentUser!, {
        displayName: docSnap.data().name,
      })
        .then(() => {
          let userClone = { ...user };
          userClone.name = docSnap.data().name;
          setIsloading(false);
        })
        .catch((error) => {});
    }
  }

  return <>{isLoading ? <Loading /> : children}</>;
}
