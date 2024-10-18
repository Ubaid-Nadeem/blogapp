"use client";

import { getAuth } from "firebase/auth";
import { useAuthContext } from "../context/context";
import { ReactNode, useEffect, useState } from "react";
import Loading from "../component/loading";
import { useRouter } from "next/navigation";

type AuthProtectedRoutesTypes = {
  children: ReactNode;
};

export default function AuthProtectedRoutes({
  children,
}: AuthProtectedRoutesTypes) {
  const { user } = useAuthContext()!;
  const [isLoading, setIsloading] = useState(true);
  const route = useRouter();
  // const auth = getAuth();

  useEffect(() => {
    const activeUser = localStorage.getItem("loggedIn");
    if (activeUser) {
      route.push("/");
    } else {
      setIsloading(false);
    }
  }, [user]);

  return <>{isLoading ? <Loading /> : children}</>;
}
