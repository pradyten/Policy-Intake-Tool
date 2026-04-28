"use client";

import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border/60 bg-[var(--color-navy)] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-gold)]">
            <Shield className="h-6 w-6 text-[var(--color-navy)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Guardian Shield
            </h1>
            <p className="text-xs text-white/60">
              Policy Intake & Analysis
            </p>
          </div>
          <Badge
            variant="outline"
            className="ml-2 border-white/30 text-white/70 text-xs"
          >
            Internal Tool
          </Badge>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/docs"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            API Docs
          </Link>
        </nav>
      </div>
    </header>
  );
}
