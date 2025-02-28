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
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300 p-6 w-full"
             style={{ backgroundImage: `url('/verify1.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="max-w-2xl w-full bg-gray-800 p-10 rounded-lg shadow-md text-center flex flex-col justify-center items-center"
                 style={{ backgroundColor: 'rgba(52, 52, 52, 0.9)' }}>
                <h2 className="text-2xl font-semibold text-white mb-4">Verify Your Email</h2>
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
                        className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition mt-4"
                        onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;
