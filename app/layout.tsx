
import type { Metadata } from "next";
import { Atma, Noto_Serif_Bengali, Tiro_Bangla, Kalam, Hind_Siliguri, Baloo_Da_2, Anek_Bangla } from 'next/font/google'
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

const atma = Atma({ subsets: ['bengali', 'latin'], weight: ['400', '700'], variable: '--font-atma', display: 'swap' })
const notoSerif = Noto_Serif_Bengali({ subsets: ['bengali'], weight: ['400', '700', '900'], variable: '--font-noto', display: 'swap' })
const tiro = Tiro_Bangla({ subsets: ['bengali'], weight: ['400'], variable: '--font-tiro', display: 'swap' })
const kalam = Kalam({ subsets: ['latin', 'devanagari'], weight: ['300', '400', '700'], variable: '--font-kalam', display: 'swap' })
const hindSiliguri = Hind_Siliguri({ subsets: ['bengali', 'latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-hind', display: 'swap' })
const balooDa2 = Baloo_Da_2({ subsets: ['bengali', 'latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-baloo', display: 'swap' })
const anekBangla = Anek_Bangla({ subsets: ['bengali'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-anek', display: 'swap' })

export const metadata: Metadata = {
  title: "Boi Ghor - বই ঘর",
  description: "Read digital books and buy hard copies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // const pathname = usePathname()
  // const isAdminpage = pathname.startsWith("/admin") || pathname.startsWith("/dashboard") || pathname.startsWith("/author");


  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={`${atma.variable} ${notoSerif.variable} ${tiro.variable} ${kalam.variable} ${hindSiliguri.variable} ${balooDa2.variable} ${anekBangla.variable} font-hind min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 flex flex-col transition-colors duration-300`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* {!isAdminpage && <Navbar />} */}
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}