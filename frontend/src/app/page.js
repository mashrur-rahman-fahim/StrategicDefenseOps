import LoginLinks from '@/app/LoginLinks';

export const metadata = {
    title: 'Strategic Defense Operations',
};

const Home = () => {
    return (
        <>
            <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
                <LoginLinks />
            </div>
        </>
    );
}

export default Home;
