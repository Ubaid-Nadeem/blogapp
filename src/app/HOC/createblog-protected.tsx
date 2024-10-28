"use client";

import { getAuth } from "firebase/auth";
import { useAuthContext } from "../context/context";
import { ReactNode, useEffect, useState } from "react";
import Loading from "../component/loading";
import { useRouter } from "next/navigation";

type AuthProtectedRoutesTypes = {
  children: ReactNode;
};

export default function CreateBlogProtectedRoutes({
  children,
}: AuthProtectedRoutesTypes) {
  const { user } = useAuthContext()!;

  const [isLoading, setIsloading] = useState(true);
  const route = useRouter();

  useEffect(() => {
    if (user == null) {
      route.push("/login");
    }
    else{
        setIsloading(false)
    }
  }, [user]);

  return <>{isLoading ? <Loading /> : children}</>;
}
