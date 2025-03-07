export const metadata = {
    title: 'Strategic Defense Operations'
}

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-900">
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-full h-full flex flex-col md:flex-row">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout
