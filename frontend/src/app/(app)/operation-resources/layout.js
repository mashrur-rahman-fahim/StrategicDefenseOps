'use client'

import { useAuth } from "@/hooks/auth"

import OperationResources from "./page"


export default function RootLayout(){
    const {user}=useAuth({middleware:"auth"})
    
    
  
    return(
        <div>
         <OperationResources user={user}/>
        
        </div>
    )
}