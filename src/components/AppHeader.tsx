import { Shield } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const links = [
  { to: "/overview", label: "Overview" },
  { to: "/", label: "Scanner" },
  { to: "/sandbox", label: "Sandbox" },
  { to: "/consents", label: "Consents" },
  { to: "/history", label: "History" },
];

export function AppHeader() {
  return (
    <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50">
      <div className="container max-w-6xl flex items-center gap-2 py-3">
        <Shield className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm text-foreground">SmartConsent</span>
        <nav className="flex items-center gap-4 ml-6">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary"
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <span className="text-xs text-muted-foreground font-mono ml-auto">v2.1 MVP</span>
      </div>
    </header>
  );
}
