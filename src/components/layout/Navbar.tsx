"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Cat, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/context/auth-context";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); 
  const isLoggedIn = !!user;
  const router = useRouter();

  const handleLogout = () => {
      logout();
      // router.push("/login"); // logout already handles redirect
  };

  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Cat className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl tracking-tight animate-pulse text-primary">PurrfectHub</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/cats" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Find a Cat
            </Link>
            <Link href="/shelters" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Shelters
            </Link>
            <Link href="/donate" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Donate
            </Link>
            
            {/* Role-based Dashboard & Chat Links */}
            {isLoggedIn && (
              <>
                <Link 
                  href={
                    user?.role === "SHELTER" ? "/dashboard/shelter" :
                    user?.role === "ADMIN" ? "/dashboard/admin" :
                    "/dashboard/adopter"
                  } 
                  className="text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link href="/chat" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                  Chat
                </Link>
              </>
            )}
            
            <div className="flex items-center gap-4">
              <ModeToggle />
              {isLoggedIn ? (
                <>
                  <Link href="/profile">
                    <Button variant="ghost" className="font-medium cursor-pointer">
                       <User className="mr-2 h-4 w-4" /> Profile
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={handleLogout} className="font-medium">
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="font-medium">Log in</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="font-medium bg-primary hover:bg-primary/90 rounded-full px-6 cursor-pointer">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <ModeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/cats" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Find a Cat
            </Link>
            <Link 
              href="/shelters" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Shelters
            </Link>
            <Link 
              href="/donate" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Donate
            </Link>
            
            {/* Mobile Dashboard & Chat Links */}
            {isLoggedIn && (
              <>
                <Link 
                  href={
                    user?.role === "SHELTER" ? "/dashboard/shelter" :
                    user?.role === "ADMIN" ? "/dashboard/admin" :
                    "/dashboard/adopter"
                  }
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/chat" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  Chat
                </Link>
              </>
            )}
            
            <div className="pt-4 flex flex-col gap-2 px-3">
              {isLoggedIn ? (
                <>
                  <Link href="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-center cursor-pointer">
                       <User className="mr-2 h-4 w-4" /> Profile
                    </Button>
                  </Link>
                   <Button variant="ghost" onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full justify-center text-destructive hover:bg-destructive/10">
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Log in</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-center bg-primary text-primary-foreground cursor-pointer">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
