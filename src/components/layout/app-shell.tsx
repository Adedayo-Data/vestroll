"use client";

import { useState } from "react";
import avatar from "@/../public/avatar/avatar.png";
import Image, { StaticImageData } from "next/image";
import MobileHeader from "./mobile-header";
import DesktopHeader from "./desktop-header";
import Sidebar from "./sidebar";
import Link from "next/link";
import { Bell, Menu, MenuSquare, Search } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email?: string;
    userType?: string;
    avatar?: string | StaticImageData;
  };
}

export default function AppShell({
  children,
  user = {
    name: "Peter",
    email: "peter@vestroll.com",
    userType: "Administrator",
    avatar: avatar,
  },
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div className="flex-1">
          {/* Top Navigation Header */}
          <header className="bg-white border-b border-[#DCE0E5] px-4 sm:px-6 py-2">
            <div className="flex items-center justify-between">
              {/* Center - Search bar */}
              <div className="flex-1 md:hidden">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="w-8 h-8 text-[#7F8C9F]" />
                </button>
              </div>

              <div className="hidden md:flex  max-w-md flex-1">
                <div className="flex items-center justify-between bg-[#F5F6F7] border border-[#DCE0E5] rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="flex-1 bg-transparent text-[#7F8C9F] focus:outline-none"
                  />
                  <Search className="w-5 h-5 text-[#7F8C9F] ml-2" />
                </div>
              </div>

              {/* Right side - User profile */}
              <div className="flex items-center gap-4 ml-4">
                <Search className="w-5 h-5 md:hidden text-[#7F8C9F] ml-2" />
                <button className="relative p-2 hover:bg-gray-100 bg-white border border-[#DCE0E5] rounded-full transition-colors">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-1 right-3 w-2 h-2 bg-[#5E2A8C] rounded-full"></span>
                </button>

                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div className="relative">
                    <Image
                      src="/user-avatar.svg"
                      alt="Peter"
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[16px] font-semibold text-[#17171C]">
                      Peter
                    </p>
                    <p className="text-[#7F8C9F] text-[10px]">Administrator</p>
                  </div>
                  <Image
                    src="/arrow-down.png"
                    alt="Dropdown arrow"
                    width={16}
                    height={16}
                    className="w-4 h-4 text-gray-400 hidden sm:block"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* second navigation bar */}

          {/* Main Content Area */}
          <main className="min-h-screen bg-[#f3f4f6]">{children}</main>
        </div>
      </div>
    </div>
  );
}


