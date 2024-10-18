"use client";
import AuthComponent from "@/app/component/authentication";
import AuthProtectedRoutes from "../HOC/auth-protected-route";

export default function signUp() {
  

  return (
    <div>
      <AuthProtectedRoutes>
      <AuthComponent authType="signup" />
      </AuthProtectedRoutes>
    </div>
  );
}
