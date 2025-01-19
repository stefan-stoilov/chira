"use client";

import { Settings, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Home",
    href: "/",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "Lorem",
    href: "/lorem",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Ipsum",
    href: "/ipsum",
    icon: Settings,
    activeIcon: Settings,
  },
  {
    label: "Dolor",
    href: "/Dolor",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

export function NavList() {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col">
      {routes.map(({ href, label, activeIcon, icon }) => {
        const isActive = pathname === href;
        const Icon = isActive ? activeIcon : icon;

        return (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md p-2.5 font-medium text-neutral-500 transition hover:text-primary",
                isActive && "bg-white text-primary shadow-sm hover:opacity-100",
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
