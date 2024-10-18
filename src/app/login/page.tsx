import AuthComponent from "@/app/component/authentication";
import AuthProtectedRoutes from "../HOC/auth-protected-route";

export default function Login() {

function loginUser(email : string,password : string){
console.log(email,password)
}

  return <>
  <AuthProtectedRoutes>
  <AuthComponent authType="login" />;
  </AuthProtectedRoutes>
  </> 
}
