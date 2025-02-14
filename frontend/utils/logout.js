import api from "./axios";

const handleLogout = async () => {
    try {
      await api.post('/logout');
  
      localStorage.removeItem("api_token");
      window.location.href = "/login"; 
  
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    }
  };
  
  export default handleLogout;