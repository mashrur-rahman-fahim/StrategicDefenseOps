import { Nunito } from 'next/font/google'
import '@/app/global.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Toaster } from 'sonner'

const nunitoFont = Nunito({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={nunitoFont.className}>
            <body className="antialiased">
                <Toaster position="bottom-right" theme='light' richColors />
                {children}
            </body>
        </html>
    )
}

export const metadata = {
    title: 'Strategic Defense Operations',
}


export default RootLayout
