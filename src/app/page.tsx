"use client";

import AllBlogs from "./component/blogs";
import Carousel from "./component/carouse";
import HomeComponent from "./component/home";
import { useAuthContext } from "./context/context";
import HomeProtectedRoutes from "./HOC/homepage-protected";

// import Navbar from "../component/navbar";

export default function Home() {
  const { user } = useAuthContext()!;

  return (
    <HomeProtectedRoutes>
      {user ? (
        <div
          style={{
            padding: "10px",
          }}
        >
          <h1 className="text-2xl font-bold   m-4">Recommendation</h1>
          <Carousel />
          <h2 className="text-2xl font-bold   m-4">Trending</h2>
          <AllBlogs />
        </div>
      ) : (
        <HomeComponent />
      )}
    </HomeProtectedRoutes>
  );
}
