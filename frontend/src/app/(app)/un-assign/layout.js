"use client"
import { useAuth } from "@/hooks/auth"
import UnAssign from "./page"

export default function RootLayout(){
    const {user}=useAuth({middleware:"auth"})
    
    return(
        <div>
            <UnAssign user={user}/>
          
        </div>
    )
}