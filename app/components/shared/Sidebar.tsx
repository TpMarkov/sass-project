"use client";

import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

// ✅ Define a proper type
type NavLink = {
  route: string;
  label: string;
  icon: string;
};

export const SidebarLink = ({
  link,
  isActive,
}: {
  link: NavLink;
  isActive: boolean;
}) => (
  <li>
    <Link
      href={link.route}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-purple-600 text-white shadow-sm"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Image
        src={link.icon}
        alt={link.label}
        width={20}
        height={20}
        className={isActive ? "brightness-200" : ""}
      />
      <span>{link.label}</span>
    </Link>
  </li>
);

const Sidebar = () => {
  const pathname = usePathname();

  // Top 6 links for the top section
  const topLinks = navLinks.slice(0, 6);

  // Bottom links (excluding Buy Credits entirely)
  const bottomLinks = navLinks.slice(6);

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-full flex-col justify-between">
        {/* Top Section */}
        <div>
          {/* Logo */}
          <div className="flex items-center justify-center border-b px-6 py-6">
            <Link href="/">
              <Image
                src="/assets/images/logo-text.svg"
                alt="logo"
                width={160}
                height={28}
                priority
              />
            </Link>
          </div>

          {/* First 6 Navigation Links */}
          <SignedIn>
            <ul className="mt-6 flex flex-col gap-1 px-4">
              {topLinks.map((link) => (
                <SidebarLink
                  key={link.route}
                  link={link}
                  isActive={link.route === pathname}
                />
              ))}
            </ul>
          </SignedIn>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 border-t px-4 py-6">
          <SignedIn>
            {/* Remaining Nav Links */}
            {bottomLinks.length > 0 && (
              <ul className="mb-4 flex flex-col gap-1">
                {bottomLinks.map((link) => (
                  <SidebarLink
                    key={link.route}
                    link={link}
                    isActive={link.route === pathname}
                  />
                ))}
              </ul>
            )}

            {/* Buy Credits Button - only rendered here */}

            {/* User Profile Button */}
            <div className="flex justify-center pt-4">
              <UserButton
                afterSignOutUrl="/"
                showName
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 mr-2 rounded-full",
                    userButtonRoot: "flex items-center px-3 py-2 gap-2",
                    userButtonUserName: "text-sm font-medium",
                  },
                }}
              />
            </div>
          </SignedIn>

          <SignedOut>
            <Button
              asChild
              className="w-full rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
