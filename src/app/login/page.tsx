import AuthComponent from "@/app/component/authentication";
import AuthProtectedRoutes from "../HOC/auth-protected-route";

export default function Login() {

  return <>
  <AuthProtectedRoutes>
  <AuthComponent authType="login" />;
  </AuthProtectedRoutes>
  </> 
}
