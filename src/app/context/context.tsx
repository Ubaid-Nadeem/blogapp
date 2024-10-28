"use client";
import { auth, db } from "@/app/firebase/firebaseconfiq";
import { UserType } from "@/app/types/usertype";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ChildrenType = {
  children: ReactNode;
};

type ContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  theme: string;
  setTheme: (theme: string) => void;
  blogs: any[];
  setBlogs: (e: any) => void;
};

const AuthContext = createContext<ContextType | null>(null);

export default function AuthContextProvider({ children }: ChildrenType) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsloading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [blogs, setBlogs] = useState([]);
  const route = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        let obj = {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
          isVerified: user.emailVerified,
        };
        setUser(obj);
        localStorage.setItem("loggedIn", JSON.stringify(obj));
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, theme, setTheme, blogs, setBlogs }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
