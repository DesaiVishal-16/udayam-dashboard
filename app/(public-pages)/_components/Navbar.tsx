"use client";

import Link from "next/link";
import Logo from "@/public/logo.png";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { buttonVariants } from "@/components/ui/button";
import { UserDropDown } from "./UserDropDown";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const isAdmin = session?.user.role === "admin";

  const NavLinks = [
    { name: "Home", href: "https://udayam.co.in" },
    { name: "Courses", href: "/courses" },
    { name: "Dashboard", href: isAdmin ? "/admin" : "/dashboard" },
  ];

  return (
    <header className="sticky top-0 z-15 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8 gap-14">
        <Link href="/" className="flex items-center gap-2">
          <Image
            width={80}
            height={80}
            src={Logo}
            alt="Udayam-AI-Labs-Logo"
            priority
          />
          <span className="font-bold text-primary tracking-tight">
            Udayam AI Labs
          </span>
        </Link>
        {/* Desktop Navgiation */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            {NavLinks.map((item) => {
              const isActive =
                item.href !== "https://udayam.co.in" &&
                pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive && "text-primary",
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isPending ? null : session ? (
              <UserDropDown
                userName={
                  session?.user.email && session.user.name.length > 0
                    ? session.user.name
                    : session?.user.email.split("@")[0]
                }
                userEmail={session.user.email}
                userImg={
                  session?.user.image ??
                  `https://avatar.vercel.sh/${session?.user.email}`
                }
              />
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Login
                </Link>
                <Link href="/login" className={buttonVariants()}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
