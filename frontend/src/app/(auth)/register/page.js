"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/auth"; // Adjust import path if needed

const Page = () => {
    const { register } = useAuth({
        middleware: "guest",
        redirectIfAuthenticated: "/dashboard",
    });

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [role_id, setRoleId] = useState(1); // Default: System Administrator
    const [parent_id, setParentId] = useState(null); // Optional
    const [errors, setErrors] = useState([]);

    const roles = [
        { id: 1, name: "System Administrator" },
        { id: 2, name: "Operations Coordinator" },
        { id: 3, name: "Field Specialist" },
        { id: 4, name: "Mission Observer" },
    ];

    const submitForm = (event) => {
        event.preventDefault();

        register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            role_id,
            parent_id,
            setErrors,
        });
    };

    return (
        <div className="flex h-screen w-screen">
            {/* Left Side - Form */}
            <div className="flex-1 bg-[#b3b08d] flex items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-lg">
                    <h2 className="text-4xl font-bold text-black font-[Stencil] text-center">
                        REGISTER
                    </h2>

                    <form onSubmit={submitForm} className="mt-6">
                        {/* Name */}
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full px-4 py-2 rounded-md border border-gray-600 mb-3 bg-white"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {errors.name && <p className="text-red-600">{errors.name}</p>}

                        {/* Email */}
                        <input
                            type="email"
                            placeholder="E-mail"
                            className="w-full px-4 py-2 rounded-md border border-gray-600 mb-3 bg-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {errors.email && <p className="text-red-600">{errors.email}</p>}

                        {/* Password */}
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 rounded-md border border-gray-600 mb-3 bg-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errors.password && <p className="text-red-600">{errors.password}</p>}

                        {/* Confirm Password */}
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full px-4 py-2 rounded-md border border-gray-600 mb-3 bg-white"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                        />
                        {errors.password_confirmation && (
                            <p className="text-red-600">{errors.password_confirmation}</p>
                        )}

                        {/* Role Selection */}
                        <select
                            value={role_id}
                            onChange={(e) => setRoleId(Number(e.target.value))}
                            className="w-full px-4 py-2 rounded-md border border-gray-600 mb-3 bg-white text-black"
                            required
                        >
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && <p className="text-red-600">{errors.role_id}</p>}

                        {/* Parent ID (Optional) */}
                        <input
                            type="number"
                            placeholder="Parent ID (Optional)"
                            className="w-full px-4 py-2 rounded-md border border-gray-600 mb-3 bg-white"
                            value={parent_id || ""}
                            onChange={(e) => setParentId(e.target.value)}
                        />
                        {errors.parent_id && <p className="text-red-600">{errors.parent_id}</p>}

                        {/* Sign Up Button */}
                        <button className="w-full bg-black text-white py-2 rounded-md mt-3 font-bold">
                            Sign UP
                        </button>

                        {/* OR Divider */}
                        <div className="text-center text-gray-700 my-3 font-bold">or</div>

                        {/* Google Button */}
                        <button className="w-full bg-black text-white py-2 rounded-md font-bold">
                            Continue with Google
                        </button>

                        {/* Already have an account? */}
                        <p className="text-center mt-3">
                            <Link href="/login" className="text-gray-700 underline">
                                Already have an account?
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Side - Image with Gradient Overlay */}
            <div className="flex-1 h-full relative">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/30"></div>

                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('/registration.jpg')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                ></div>
            </div>
        </div>
    );
};

export default Page;
