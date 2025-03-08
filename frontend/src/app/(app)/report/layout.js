'use client';
import { useAuth } from '@/hooks/auth';
import Loading from '../../../components/Loading';
import Navigation from '../chatbot/Navigation';

export default function RootLayout({ children }) {
    const { user, logout } = useAuth({ middleware: 'auth' });
    if (!user) {
        return <Loading />;
    }
    return (
        <div className="chatbot-navigation">
            <Navigation logout={logout} />

            <main>{children}</main>
        </div>
    );
}
