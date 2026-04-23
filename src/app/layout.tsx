import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "CYNA — DAT / DCT",
    description: "Documentation technique interactive de la plateforme e-commerce CYNA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return children as React.ReactElement;
}
