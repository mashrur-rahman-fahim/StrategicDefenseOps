"use client";
export default function Navigation({logout}){
    
   
    return(
        <div>
           <button type="button" onClick={logout}>
            logout
            
            </button> 
        </div>
    )
}