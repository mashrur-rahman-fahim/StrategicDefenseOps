"use client"
import { useAuth } from "@/hooks/auth"
import ViewRoles from "./page"

export default function RootLayout(){
    const {user}=useAuth({middleware:"auth"})
    
    return (
        <div>

            <ViewRoles user={user}/>
        </div>    
    )
}