import { Nunito } from 'next/font/google'
import { Toaster } from 'sonner'
import '@/app/global.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const nunitoFont = Nunito({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={nunitoFont.className}>
            <body className="antialiased">
                {children}
                <Toaster position="bottom-right" theme='light' richColors />
            </body>
        </html>
    )
}

export const metadata = {
    title: 'Strategic Defense Operations',
}


export default RootLayout
