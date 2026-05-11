"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { BarChart2, Video, Settings, Zap, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",        icon: BarChart2, label: "Dashboard" },
  { href: "/dashboard/videos", icon: Video,     label: "My Videos"  },
  { href: "/dashboard/settings", icon: Settings, label: "Settings"  },
];

interface SidebarProps {
  creditsBalance: number;
}

export function Sidebar({ creditsBalance }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#111111] border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold">
          <span className="text-2xl">🎬</span>
          <span>FacelessReels</span>
        </Link>
      </div>

      {/* Generate button */}
      <div className="p-4">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-500 transition-colors rounded-lg text-sm font-semibold"
        >
          <Plus size={16} />
          New Video
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              pathname === href
                ? "bg-violet-600/20 text-violet-400 font-medium"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Credits + User */}
      <div className="p-4 border-t border-white/5 space-y-3">
        <Link
          href="/dashboard/billing"
          className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/8 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2 text-sm">
            <Zap size={16} className="text-yellow-400" />
            <span className="font-medium">{creditsBalance} credits</span>
          </div>
          <span className="text-xs text-violet-400 font-medium">Buy more →</span>
        </Link>
        <div className="flex items-center gap-3 px-1">
          <UserButton afterSignOutUrl="/" />
          <span className="text-sm text-white/60">Account</span>
        </div>
      </div>
    </aside>
  );
}
