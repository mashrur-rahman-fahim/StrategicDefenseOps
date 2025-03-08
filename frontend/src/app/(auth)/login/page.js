'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus';
import { FiHome } from 'react-icons/fi';

const Login = () => {
    const router = useRouter();
    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [shouldRemember, setShouldRemember] = useState(false);
    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (router.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.reset));
        } else {
            setStatus(null);
        }
    }, [router.reset, errors]);

    const submitForm = async (event) => {
        event.preventDefault();
        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        });
    }

    const handleGoogleLogin = async () => {
        try {
            window.location.href = `http://127.0.0.1:8000/auth/google`;
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    return (
        <div className="flex h-screen w-screen">
            {/* Left Side - Form */}
            <div className="flex-1 bg-[#446158] flex items-center justify-center p-6 md:p-10 rounded-r-xl relative">
                {/* Home Navigation Icon */}
                <Link 
                    href="/" 
                    className="absolute top-4 left-4 text-white hover:text-gray-200 transition-colors"
                    title="Return to Home"
                >
                    <FiHome className="w-8 h-8" />
                </Link>

                <div className="w-full max-w-lg">
                    <h2 className="text-4xl font-bold text-black font-[Stencil] text-center">
                        LOGIN
                    </h2>
                    <AuthSessionStatus className="mb-4" status={status} />
                    <form onSubmit={submitForm} className="mt-6">
                        {/* Email */}
                        <input
                            type="email"
                            placeholder="E-mail"
                            className="w-full px-4 py-2 rounded-md border border-gray-600 mb-3 bg-white text-black placeholder-gray-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-600">{errors.email}</p>
                        )}

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className="w-full px-4 py-2 rounded-md border border-gray-600 mb-3 bg-white text-black placeholder-gray-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '🙈'}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-600">{errors.password}</p>
                        )}

                        {/* Forgot Password */}
                        <div className="text-right mt-3">
                            <Link
                                href="/forgot-password"
                                className="text-white underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        {/* Remember Me */}
                        <div className="block mt-4">
                            <label
                                htmlFor="remember_me"
                                className="inline-flex items-center"
                            >
                                <input
                                    id="remember_me"
                                    type="checkbox"
                                    name="remember"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm"
                                    onChange={(e) =>
                                        setShouldRemember(e.target.checked)
                                    }
                                />
                                <span className="ml-2 text-sm text-white">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        {/* Login Button */}
                        <button className="w-full bg-black text-white py-2 rounded-md mt-3 font-bold">
                            Login
                        </button>

                        {/* OR Divider */}
                        {/* <div className="text-center text-white my-3 font-bold">
                            or
                        </div> */}

                        {/* Google Button */}
                        {/* <button
                            onClick={handleGoogleLogin}
                            className="w-full bg-black text-white py-2 rounded-md font-bold"
                        >
                            Continue with Google
                        </button> */}

                        {/* Don't have an account? */}
                        <p className="text-center mt-3">
                            <Link
                                href="/register"
                                className="text-white underline"
                            >
                                Don't have an account?
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Side - Image with Gradient Overlay */}
            <div className="flex-1 h-full relative">
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/30" />
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://res.cloudinary.com/dv97iagt7/image/upload/v1741465703/login1_xtyatb.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </div>
        </div>
    );
}

export default Login;