"use client";

import HomeComponent from "./component/home";
import { useAuthContext } from "./context/context";
import HomeProtectedRoutes from "./HOC/homepage-protected";


// import Navbar from "../component/navbar";

export default function Home() {

const { user } = useAuthContext()!;

  return (
    <HomeProtectedRoutes>
      {user ? <div>
        <h1 className="text-2xl text-center">Welcome to my blog app</h1>
      </div> : <HomeComponent />}
    </HomeProtectedRoutes>
  );
}
