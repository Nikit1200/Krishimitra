import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Check, ChevronDown, Languages, LogOut, Menu, Sprout, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { type LanguageCode, useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

type LanguageDropdownProps = {
  mobile?: boolean;
  onSelect?: () => void;
};

const LanguageDropdown = ({ mobile = false, onSelect }: LanguageDropdownProps) => {
  const { language, setLanguage, languageOptions, copy } = useLanguage();

  const selectedLanguage =
    languageOptions.find((option) => option.code === language) ?? languageOptions[0];

  const handleLanguageSelect = (value: string) => {
    setLanguage(value as LanguageCode);
    onSelect?.();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 rounded-full border-border/70 bg-background/80 px-3 text-sm shadow-sm transition-all hover:border-primary/40 hover:bg-accent/50",
            mobile && "w-full justify-between rounded-xl px-4 py-5 text-base",
          )}
          aria-label={`${copy.nav.languageMenu}: ${selectedLanguage.label}`}
        >
          <span className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-primary" />
            <span>{selectedLanguage.buttonLabel}</span>
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={mobile ? "start" : "end"}
        className="w-64 rounded-2xl border-border/70 bg-popover/95 p-2 shadow-xl backdrop-blur"
      >
        <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {copy.nav.chooseLanguage}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup value={language} onValueChange={handleLanguageSelect}>
          {languageOptions.map((option) => {
            const isSelected = option.code === language;

            return (
              <DropdownMenuRadioItem
                key={option.code}
                value={option.code}
                className={cn(
                  "mt-1 rounded-xl px-3 py-3 focus:bg-accent/80",
                  isSelected && "bg-primary/10 text-primary",
                )}
                aria-label={`${option.label} language`}
              >
                <div className="flex w-full items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{option.nativeLabel}</span>
                    {option.label !== option.nativeLabel && (
                      <span className="text-xs text-muted-foreground">{option.label}</span>
                    )}
                  </div>

                  {isSelected && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                      <Check className="h-3 w-3" />
                      Active
                    </span>
                  )}
                </div>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { copy } = useLanguage();

  const navItems = user
    ? [
        { href: "/dashboard", label: copy.nav.dashboard },
        { href: "/schemes", label: copy.nav.schemes },
        { href: "/weather", label: copy.nav.weather },
        { href: "/mandi-prices", label: copy.nav.mandiPrices },
      ]
    : [
        { href: "/", label: copy.nav.home },
        { href: "/login", label: copy.nav.login },
      ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2">
          <Sprout className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">FarmAssist</span>
        </Link>

        <div className="hidden items-center space-x-4 md:flex">
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href) ? "text-primary" : "text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <LanguageDropdown />

          {user && (
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                {copy.nav.profile}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {copy.nav.logout}
              </Button>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Open navigation menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="mt-8 flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      isActive(item.href) ? "text-primary" : "text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}

                <LanguageDropdown mobile onSelect={() => setIsOpen(false)} />

                {user && (
                  <div className="space-y-4 border-t pt-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate("/profile");
                        setIsOpen(false);
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      {copy.nav.profile}
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {copy.nav.logout}
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
