"use client";
import useSWR from "swr";
import axios from "@/lib/axios";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter();
    const params = useParams();

    const {
        data: user,
        error,
        mutate,
    } = useSWR("/api/user", () =>
        axios
            .get("/api/user")
            .then((res) => res.data)
            .catch((error) => {
                if (error.response.status !== 409) throw error;

                router.push("/verify-email");
            }),
    );

    const csrf = () => axios.get("/sanctum/csrf-cookie");

    const register = async ({ setErrors, ...props }) => {
        await csrf();

        setErrors([]);

        axios
            .post("/register", props)
            .then((response) => {
                const token = response.data.token;
                localStorage.setItem("api_token", token);
                toast.success("Registered successfully and verify your email");
                mutate();
            })
            .catch((error) => {
                toast.error("Failed to register");
                if (error.response.status !== 422) throw error;

                setErrors(error.response.data.errors);
            })
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        
        await csrf();

        setErrors([]);
        setStatus(null);

        axios
            .post("/login", props)
            .then((response) => {
              
                const token = response.data.token;
                localStorage.setItem("api_token", token);
                
                mutate();
            })
            .catch((error) => {
                   toast.error("Failed to login");
                if (error.response.status !== 422) throw error;

                setErrors(error.response.data.errors);
            })
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf();

        setErrors([]);
        setStatus(null);

        axios
            .post("/forgot-password", { email })
            .then((response) => setStatus(response.data.status))
            .catch((error) => {
                if (error.response.status !== 422) throw error;

                setErrors(error.response.data.errors);
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf();

        setErrors([]);
        setStatus(null);

        axios
            .post("/reset-password", { token: params.token, ...props })
            .then((response) =>
                router.push("/login?reset=" + btoa(response.data.status)),
            )
            .catch((error) => {
                if (error.response.status !== 422) throw error;

                setErrors(error.response.data.errors);
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post("/email/verification-notification")
            .then((response) => setStatus(response.data.status));
    }

    const logout = async () => {
    try {
        await csrf();

        await axios.post("/logout");

        toast.success("Logged out successfully");

        // Optional: refresh auth state
        mutate();

        window.location.pathname = "/";
    } catch (error) {
        console.error("Logout error:", error);
        toast.error("Failed to log out. Please try again.");
    }
};

    useEffect(() => {
        if (middleware === "guest" && redirectIfAuthenticated && user) {
            
            router.push(redirectIfAuthenticated);
           
        }

        if (user && middleware === "auth" && !user?.email_verified_at) {
            
            router.push("/verify-email");
             
        }

        if (
            window.location.pathname === "/verify-email" &&
            user?.email_verified_at
        ) {
             
            router.push(redirectIfAuthenticated);
            
        }
        if (middleware === "auth" && error) {
           
            logout();
             
        }
    }, [user, error]);

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    };
}
