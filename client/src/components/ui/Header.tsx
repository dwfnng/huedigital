import { motion } from "framer-motion";
import { Link } from "wouter";
import { Crown, Menu } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 header-gradient" />
      
      {/* Main header content */}
      <div className="relative container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and site title */}
          <Link href="/">
            <a className="flex items-center space-x-3">
              <Crown className="h-8 w-8 text-[#F5E6CC]" />
              <h1 className="font-eb-garamond text-2xl font-semibold text-[#F5E6CC]">
                Huế Heritage
              </h1>
            </a>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink href="/tour">Tham quan</NavLink>
            <NavLink href="/ticket">Đặt vé & Dịch vụ</NavLink>
            <NavLink href="/culture">Văn hóa</NavLink>
            <NavLink href="/gallery">Thư viện ảnh</NavLink>
            <NavLink href="/contact">Liên hệ</NavLink>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            className="md:hidden text-[#F5E6CC]"
            size="icon"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Decorative border */}
      <div className="relative h-2 bg-[#DAA520]/20">
        <div className="absolute inset-0 header-decoration" />
      </div>
    </motion.header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <a className={cn(
        "font-eb-garamond text-lg text-[#F5E6CC]/90 hover:text-[#F5E6CC]",
        "transition-colors duration-200",
        "relative after:absolute after:bottom-0 after:left-0 after:h-0.5",
        "after:w-0 hover:after:w-full after:bg-[#F5E6CC]",
        "after:transition-all after:duration-300"
      )}>
        {children}
      </a>
    </Link>
  );
}

export default Header;
