'use client'

import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus';
import Link from 'next/link';

const Page = () => {
    const { forgotPassword } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    });

    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);

    const submitForm = event => {
        event.preventDefault();
        forgotPassword({ email, setErrors, setStatus });
    };

    return (
        <div className="flex h-screen w-screen">
            {/* Left Side - Form */}
            <div className="flex-1 bg-[#74624D] flex items-center justify-center p-6 md:p-10 rounded-r-xl">
                <div className="w-full max-w-lg">
                    <h2 className="text-4xl font-bold text-black font-[Stencil] text-center">
                        FORGOT PASSWORD
                    </h2>

                    {/* <p className="text-sm text-gray-600 text-center mt-2">
                        Forgot your password? No problem. Just enter your email and we’ll send you a reset link.
                    </p> */}

                    {/* Session Status */}
                    <AuthSessionStatus className="mb-4" status={status} />

                    <form onSubmit={submitForm} className="mt-6">
                        {/* Email Address */}
                        <input
                            type="email"
                            placeholder="E-mail"
                            className="w-full px-4 py-2 rounded-md border border-gray-600 mb-3 bg-white text-black placeholder-gray-500"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            required
                        />
                        {errors.email && <p className="text-red-600">{errors.email}</p>}

                        {/* Submit Button */}
                        <button className="w-full bg-black text-white py-2 rounded-md mt-3 font-bold">
                            Email Password Reset Link
                        </button>

                        {/* Don't have an account? */}
                        <p className="text-center mt-3">
                            <Link href="/register" className="text-white underline">
                                Don't have an account?
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Side - Image with Gradient Overlay */}
            <div className="flex-1 h-full relative">
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/30"></div>
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/forgot1.jpg')` }}
                ></div>
            </div>
        </div>
    );
};

export default Page;
