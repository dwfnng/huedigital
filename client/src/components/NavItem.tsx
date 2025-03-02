
import { Link } from "wouter";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationMenuItem } from "@/components/ui/navigation-menu";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
}

export function NavItem({ href, icon: Icon, label, isActive }: NavItemProps) {
  return (
    <NavigationMenuItem>
      <Link href={href}>
        <span
          className={cn(
            "flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer transition-colors",
            isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          )}
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </span>
      </Link>
    </NavigationMenuItem>
  );
}
