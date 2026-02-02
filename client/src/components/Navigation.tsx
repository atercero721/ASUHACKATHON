import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Menu, X, BookOpen, Calendar, DollarSign, 
  User, LifeBuoy, GraduationCap, Bell 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "My ASU", icon: GraduationCap },
    { href: "/classes", label: "My Classes", icon: BookOpen },
    { href: "/finances", label: "Finances", icon: DollarSign },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/support", label: "Service Center", icon: LifeBuoy },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-primary shadow-xl border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo Area */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden text-white hover:text-secondary transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link href="/" className="flex items-center gap-3 group">
                {/* Static Logo Mock */}
                <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                  <span className="font-display font-bold text-primary text-xl">U</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-display font-bold text-xl leading-none">
                    UNIVERSITY
                  </span>
                  <span className="text-white/80 text-xs font-sans tracking-wider uppercase">
                    Student Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`
                      px-4 py-2 rounded-md font-medium text-sm transition-all duration-200
                      flex items-center gap-2
                      ${isActive 
                        ? "bg-white/10 text-white shadow-inner" 
                        : "text-white/80 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? "text-secondary" : ""}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User Profile / Notifications */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-white/80 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border border-primary" />
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-white">Andy S.</span>
                  <span className="text-xs text-white/60">Undergraduate</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shadow-lg ring-2 ring-white/10">
                  <span className="font-bold text-primary">AS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-primary border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    block px-4 py-3 rounded-lg text-base font-medium
                    ${location === item.href 
                      ? "bg-white/10 text-white" 
                      : "text-white/70 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
