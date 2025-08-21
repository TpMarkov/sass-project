"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-white sm:hidden">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/assets/images/logo-text.svg"
          alt="logo"
          width={150}
          height={28}
        />
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-3">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />

          {/* Sidebar Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md hover:bg-gray-100">
                <Image
                  src="/assets/icons/menu.svg"
                  alt="menu"
                  width={28}
                  height={28}
                />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-64 bg-white flex flex-col justify-between"
            >
              <div>
                {/* Sidebar Logo */}
                <div className="flex justify-center py-6 border-b">
                  <Image
                    src="/assets/images/logo-text.svg"
                    alt="logo"
                    width={140}
                    height={24}
                  />
                </div>

                {/* Navigation Links */}
                <ul className="flex flex-col gap-1 mt-6 px-4">
                  {navLinks.map((link) => {
                    const isActive = link.route === pathname;

                    return (
                      <li key={link.route}>
                        <Link
                          href={link.route}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                            isActive
                              ? "bg-purple-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <Image
                            src={link.icon}
                            alt="icon"
                            width={20}
                            height={20}
                          />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Footer */}
              <div className="p-4 border-t text-xs text-gray-500">
                © {new Date().getFullYear()} MyApp
              </div>
            </SheetContent>
          </Sheet>
        </SignedIn>

        <SignedOut>
          <Button
            asChild
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-4 py-2 text-sm"
          >
            <Link href="/sign-in">Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
};

export default MobileNav;
