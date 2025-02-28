'use client';

import { useAuth } from "@/hooks/auth";
import Assign from "./page";


export default function RootLayout({children}){
    const {user,logout}=useAuth({middleware:"auth"});
    
    
  
    return(
        <div>
         <Assign user={user}/>
          <main>{children}</main>
        </div>
    )
}