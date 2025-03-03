"use client";
import { useAuth } from "@/hooks/auth";
import RoleView from "./page";

export default function RootLayout({children}){
    const {user}=useAuth({middleware:"auth"});
    
    
    return(
        <div>
            <RoleView user={user}/>
            <main>{children}</main>
        </div>)
}