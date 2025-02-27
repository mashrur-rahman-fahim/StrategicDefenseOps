'use client';

import Button from '@/components/Button';
import { useAuth } from '@/hooks/auth';
import { useState } from 'react';

const Page = () => {
    const { logout, resendEmailVerification } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    });

    const [status, setStatus] = useState(null);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300 p-6 w-full">
            <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-md text-center flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold text-white mb-4">Verify Your Email</h2>
                <p className="text-sm text-gray-400 mb-6">
                    Thanks for signing up! Before getting started, please verify your email address by clicking on the link we just sent you. If you didn't receive the email, we will gladly send you another.
                </p>

                {status === 'verification-link-sent' && (
                    <div className="mb-4 text-green-500 text-sm font-medium">
                        A new verification link has been sent to your email.
                    </div>
                )}

                <div className="flex flex-col gap-4 w-full">
                    <Button
                        onClick={() => resendEmailVerification({ setStatus })}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
                        Resend Verification Email
                    </Button>
                    <button
                        type="button"
                        className="text-sm text-gray-400 hover:text-white transition"
                        onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;