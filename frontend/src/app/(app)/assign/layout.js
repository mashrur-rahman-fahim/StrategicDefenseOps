'use client'

import { useAuth } from "@/hooks/auth"
import Assign from "./page"


export default function RootLayout(){
    const {user}=useAuth({middleware:"auth"})
    
    
  
    return(
        <div>
         <Assign user={user}/>
        
        </div>
    )
}