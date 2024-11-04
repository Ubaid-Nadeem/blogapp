"use client";

import { getAuth } from "firebase/auth";
import { useAuthContext } from "../context/context";
import { ReactNode, useEffect, useState } from "react";
import Loading from "../component/loading";
import { useRouter } from "next/navigation";

type AuthProtectedRoutesTypes = {
  children: ReactNode;
};

export default function MyBlogProtectedRoutes({
  children,
}: AuthProtectedRoutesTypes) {
  const { user } = useAuthContext()!;

  const [isLoading, setIsloading] = useState(true);
  const route = useRouter();

  useEffect(() => {
    const activeUser = localStorage.getItem("loggedIn");
    if (activeUser) {
      setIsloading(false);
    } else {
      route.push("/");
    }
  }, [user]);

  return <>{isLoading ? <Loading /> : children}</>;
}
