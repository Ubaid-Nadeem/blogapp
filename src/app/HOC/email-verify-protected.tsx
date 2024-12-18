"use client";

import { getAuth } from "firebase/auth";
import { useAuthContext } from "../context/context";
import { ReactNode, useEffect, useState } from "react";
import Loading from "../component/loading";
import { useRouter } from "next/navigation";
import { auth } from "../firebase/firebaseconfiq";

type AuthProtectedRoutesTypes = {
  children: ReactNode;
};

export default function EmailProtectedRoutes({
  children,
}: AuthProtectedRoutesTypes) {
  const { user } = useAuthContext()!;
  const [isLoading, setIsloading] = useState(true);
  const route = useRouter();
  // const auth = getAuth();

  useEffect(() => {
    console.log(auth.currentUser);

    if (!user?.isVerified && user) {
      route.push("/email-verify");
      setIsloading(false);
    } else if ((user?.isVerified && user) || user == null) {
      setIsloading(false);
    }
  }, [user]);

  return <>{isLoading ? <Loading /> : children}</>;
}
