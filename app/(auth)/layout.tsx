"use client"

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Logo from "@/public/logo.png";
import { buttonVariants } from "@/components/ui/button";
import { ReactNode } from "react";

export default function AuthLayout({ children }:{ children: ReactNode}){
  return (
  <div className="relative min-h-svh flex flex-col items-center gap-4 justify-center"> 
    <Link href="/" className={buttonVariants({
        variant:"outline", className:"absolute top-4 left-4" 
      })}>
        <ArrowLeft className="size-4"/> 
        Back
    </Link>
    <div className="flex w-full max-w-sm flex-col gap-6 relative right-5">
      <Link className="flex items-center gap-2 self-center text-2xl font-black text-(--primary-color)" href="/">
        <Image src={Logo} alt="Udayam AI Labs Logo" width={100} height={100}/>
        Udayam AI Labs
      </Link>
    </div>
    <div className="flex w-full max-w-sm flex-col gap-6">
       {children}
    </div>
    <div className="text-balance text-center text-sm text-muted-foreground w-sm">
       By Clicking continue, you agree with our {""}
        <span className="hover:text-primary hover:underline ">Terms of services</span> and {""}
        <span className="hover:text-primary hover:underline">Privacy Policy</span>. 
    </div>
  </div>
  )
};
