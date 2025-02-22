"use client";

import { useState } from "react";
import Link from "next/link";

const Page = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [officerId, setOfficerId] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [errors, setErrors] = useState([]);

    const submitForm = (event) => {
        event.preventDefault();
        // Handle form submission logic here
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
                        {/* Form Inputs */}
                        {[
                            { label: "Name", type: "text", value: name, setter: setName },
                            { label: "E-mail", type: "email", value: email, setter: setEmail },
                            { label: "Password", type: "password", value: password, setter: setPassword },
                            { label: "Confirm Password", type: "password", value: passwordConfirmation, setter: setPasswordConfirmation },
                            { label: "Officer ID", type: "text", value: officerId, setter: setOfficerId },
                            { label: "Phone", type: "tel", value: phone, setter: setPhone },
                            { label: "Address", type: "text", value: address, setter: setAddress },
                        ].map((input, index) => (
                            <input
                                key={index}
                                type={input.type}
                                placeholder={input.label}
                                className="w-full px-4 py-2 rounded-md border border-gray-600 mb-3 bg-white"
                                value={input.value}
                                onChange={(e) => input.setter(e.target.value)}
                                required
                            />
                        ))}

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
