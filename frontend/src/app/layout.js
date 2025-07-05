import { Nunito } from "next/font/google";
import "@/app/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster } from "react-hot-toast";
import React from "react";
const nunitoFont = Nunito({
    subsets: ["latin"],
    display: "swap",
});

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={nunitoFont.className}>
            <body className="antialiased">
                <Toaster position="top-right" />
                {children}</body>
        </html>
    );
};

export const metadata = {
    title: "Strategic Defense Operations",
};

export default RootLayout;
