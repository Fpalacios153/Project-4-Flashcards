import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from "next/font/google";
import "./globals.css";
import theme from "./theme";
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';



import NavBar from './components/navBar';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SmartyCards",
  description: "Ai powered flashcard generator",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <body className={inter.className}>
              <NavBar />
              {children}
            </body>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </html>
    </ClerkProvider>
  );
}
