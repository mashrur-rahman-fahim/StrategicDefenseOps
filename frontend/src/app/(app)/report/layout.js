"use client";
import { useAuth } from "@/hooks/auth";
import Loading from "../Loading";
import Navigation from "../chatbot/Navigation";
import Layout from '../components/layout'; 


export default function RootLayout({children}){
    
    const {user,logout}=useAuth({middleware:"auth"});
    if(!user){
        return <Loading/>;
    }
    return (
          <Layout>  
        <div className="chatbot-navigation">
            
        <Navigation  logout={logout}/>
        
        <main>{children}</main>
    </div>
      </Layout> 
    );
}