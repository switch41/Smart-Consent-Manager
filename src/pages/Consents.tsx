import { useState } from "react";
import { Cookie, BarChart3, Megaphone, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AppHeader } from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";

interface ConsentCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  required?: boolean;
  defaultEnabled: boolean;
}

const categories: ConsentCategory[] = [
  {
    id: "essential",
    label: "Essential Cookies",
    description: "Required for the website to function properly",
    icon: <Cookie className="h-5 w-5 text-accent" />,
    required: true,
    defaultEnabled: true,
  },
  {
    id: "analytics",
    label: "Analytics Cookies",
    description: "Help us understand how you use the website",
    icon: <BarChart3 className="h-5 w-5 text-primary" />,
    defaultEnabled: false,
  },
  {
    id: "marketing",
    label: "Marketing Cookies",
    description: "Used to show you relevant advertisements",
    icon: <Megaphone className="h-5 w-5 text-warning" />,
    defaultEnabled: false,
  },
  {
    id: "thirdparty",
    label: "Third-Party Cookies",
    description: "Set by external services and partners",
    icon: <Globe className="h-5 w-5 text-destructive" />,
    defaultEnabled: false,
  },
];

const Consents = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map((c) => [c.id, c.defaultEnabled]))
  );

  const handleToggle = (id: string) => {
    setPreferences((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    localStorage.setItem("consent-preferences", JSON.stringify(preferences));
    toast({
      title: "Preferences Saved",
      description: "Your cookie consent preferences have been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <AppHeader />

      <main className="container max-w-2xl py-12 space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-1">
            <Cookie className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">Manage Consent Preferences</h1>
          </div>
          <p className="text-sm text-muted-foreground">Control what data you share with websites</p>
        </section>

        <Card className="border-border bg-card">
          <CardContent className="p-0">
            {categories.map((cat, idx) => (
              <div key={cat.id}>
                {idx > 0 && <Separator />}
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{cat.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{cat.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences[cat.id]}
                    onCheckedChange={() => !cat.required && handleToggle(cat.id)}
                    disabled={cat.required}
                    className={cat.required ? "opacity-100" : ""}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full" size="lg">
          Save Preferences
        </Button>
      </main>
    </div>
  );
};

export default Consents;
