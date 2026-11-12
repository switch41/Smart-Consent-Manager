import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  ShieldCheck, Loader2, ExternalLink, Image, FileText, Link2,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SandboxResult {
  title: string;
  description: string;
  markdown: string;
  screenshot: string | null;
  links: string[];
  sourceUrl: string;
}

const Sandbox = () => {
  const [searchParams] = useSearchParams();
  const initialUrl = searchParams.get("url") || "";
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SandboxResult | null>(null);
  const { toast } = useToast();

  const handleBrowse = useCallback(async (targetUrl?: string) => {
    const browseUrl = targetUrl || url;
    if (!browseUrl.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("sandbox-browse", {
        body: { url: browseUrl.trim() },
      });

      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error || "Failed to load page");

      setResult(data);
      toast({ title: "Safe snapshot ready", description: `Loaded ${data.title}` });
    } catch (err) {
      toast({
        title: "Sandbox error",
        description: err instanceof Error ? err.message : "Could not load the page safely",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [url, toast]);

  // Auto-load if URL param provided
  useEffect(() => {
    if (initialUrl) {
      handleBrowse(initialUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background grid-bg">
      <AppHeader />

      <main className="container max-w-6xl py-12 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <h1 className="text-xl font-semibold text-foreground">Safe Sandbox</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Browse any website safely — no trackers, no scripts, no cookies. Just clean content.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleBrowse(); }} className="flex gap-3">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to browse safely (e.g. example.com)"
            className="flex-1 font-mono text-sm"
          />
          <Button type="submit" disabled={loading || !url.trim()}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading…
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 mr-2" />
                Browse Safely
              </>
            )}
          </Button>
        </form>

        {loading && (
          <Card className="border-border bg-card">
            <CardContent className="py-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-3" />
              <p className="text-sm text-muted-foreground">Creating safe snapshot…</p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">Stripping trackers, cookies & scripts</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <Card className="border-border bg-card">
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="default" className="text-[10px] bg-accent/20 text-accent border-accent/30">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        SANDBOXED
                      </Badge>
                    </div>
                    <h2 className="text-lg font-semibold text-foreground truncate">{result.title}</h2>
                    {result.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.description}</p>
                    )}
                    <p className="text-[10px] font-mono text-muted-foreground mt-2">{result.sourceUrl}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild className="shrink-0">
                    <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      Original
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Content tabs */}
            <Tabs defaultValue={result.screenshot ? "screenshot" : "content"} className="space-y-4">
              <TabsList>
                {result.screenshot && (
                  <TabsTrigger value="screenshot" className="text-xs font-mono">
                    <Image className="h-3.5 w-3.5 mr-1.5" />
                    Screenshot
                  </TabsTrigger>
                )}
                <TabsTrigger value="content" className="text-xs font-mono">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="links" className="text-xs font-mono">
                  <Link2 className="h-3.5 w-3.5 mr-1.5" />
                  Links ({result.links.length})
                </TabsTrigger>
              </TabsList>

              {result.screenshot && (
                <TabsContent value="screenshot">
                  <Card className="border-border bg-card overflow-hidden">
                    <CardContent className="p-0">
                      <img
                        src={result.screenshot}
                        alt={`Screenshot of ${result.title}`}
                        className="w-full h-auto"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              <TabsContent value="content">
                <Card className="border-border bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-foreground">
                      Clean Content (No Scripts / Trackers)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none max-h-[70vh] overflow-y-auto">
                      {result.markdown ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.markdown}</ReactMarkdown>
                      ) : "No readable content found."}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="links">
                <Card className="border-border bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-foreground">
                      Links Found on Page
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.links.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No links found</p>
                    ) : (
                      <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                        {result.links.slice(0, 100).map((link, i) => (
                          <div key={i} className="flex items-center gap-2 group">
                            <button
                              onClick={() => {
                                setUrl(link);
                                handleBrowse(link);
                              }}
                              className="text-xs font-mono text-primary hover:underline truncate text-left flex-1"
                              title={`Browse safely: ${link}`}
                            >
                              {link}
                            </button>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            </a>
                          </div>
                        ))}
                        {result.links.length > 100 && (
                          <p className="text-[10px] text-muted-foreground mt-2">
                            Showing 100 of {result.links.length} links
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
};

export default Sandbox;
