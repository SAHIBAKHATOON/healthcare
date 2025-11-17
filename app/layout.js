import { Inter } from "next/font/google";
import "./globals.css";
import { z } from "zod";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });
const clerkPublishableKey =
  process.env.CLERK_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "";

export const metadata = {
  title: "Medimeet App",
  description: "Medimeet App - Doctors Appointment App",
};

function AppShell({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-screen">{children}</main>
          <footer className="bg-muted/50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-200">
              <p>© 2023 Medimeet. All rights reserved.</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function RootLayout({ children }) {
  if (!clerkPublishableKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Clerk publishable key is not configured. Rendering without ClerkProvider."
      );
    }
    return <AppShell>{children}</AppShell>;
  }

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      appearance={{
        baseTheme: dark,
      }}
    >
      <AppShell>{children}</AppShell>
    </ClerkProvider>
  );
}
