import ProfileProtectedRoutes from "../HOC/profile-protected";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    return  <ProfileProtectedRoutes>
       {children} 
    </ProfileProtectedRoutes>
}
