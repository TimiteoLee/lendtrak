"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Wrench, Users, Plus, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Ledger", icon: BookOpen },
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "/people", label: "People", icon: Users },
  { href: "/lend", label: "Lend", icon: Plus },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop header */}
      <header className="hidden md:block" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl tracking-widest uppercase font-normal">
            ToolTrack
          </Link>
          <nav className="flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm uppercase tracking-wider transition-colors ${
                  pathname === item.href
                    ? "nav-link-active"
                    : "hover:opacity-80"
                }`}
                style={{
                  color:
                    pathname === item.href ? "var(--fg)" : "var(--fg-faint)",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          backgroundColor: "var(--bg)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 px-2 py-1 transition-colors"
                style={{ color: isActive ? "var(--fg)" : "var(--fg-faint)" }}
              >
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[10px] uppercase tracking-wider">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile header */}
      <header
        className="md:hidden"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="px-4 py-3 text-center">
          <Link href="/" className="text-lg tracking-widest uppercase">
            ToolTrack
          </Link>
        </div>
      </header>
    </>
  );
}
