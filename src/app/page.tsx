"use client";

import AllBlogs from "./component/blogs";
import Carousel from "./component/carouse";
import HomeComponent from "./component/home";
import { useAuthContext } from "./context/context";
import HomeProtectedRoutes from "./HOC/homepage-protected";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import MainPage from "./component/main-page";
import { useState } from "react";

// import Navbar from "../component/navbar";

export default function Home() {
  const { user } = useAuthContext()!;
  // const [darkTheme, setDarkTheme] = useState(false);

  return (
    <HomeProtectedRoutes >
      {user ? (
       <MainPage/>
      ) : (
        <HomeComponent />
      )}
    </HomeProtectedRoutes>
  );
}
