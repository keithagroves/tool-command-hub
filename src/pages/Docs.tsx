import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Github, FileText, Shield, Terminal, Key, Lock, BookOpen, Code, Workflow, FileCode } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocSection {
  id: string;
  title: string;
  file: string;
  icon: React.ReactNode;
  category: string;
}

const docSections: DocSection[] = [
  {
    id: "readme",
    title: "Getting Started",
    file: "/docs/README.md",
    icon: <BookOpen className="w-4 h-4" />,
    category: "Overview"
  },
  {
    id: "spec",
    title: "Protocol Specification",
    file: "/docs/SPEC.md",
    icon: <FileText className="w-4 h-4" />,
    category: "Core Documentation"
  },
  {
    id: "commands",
    title: "CLI Commands",
    file: "/docs/COMMANDS.md",
    icon: <Terminal className="w-4 h-4" />,
    category: "Core Documentation"
  },
  {
    id: "api",
    title: "API Reference",
    file: "/docs/API.md",
    icon: <Code className="w-4 h-4" />,
    category: "Core Documentation"
  },
  {
    id: "trust",
    title: "Trust System",
    file: "/docs/TRUST.md",
    icon: <Shield className="w-4 h-4" />,
    category: "Security"
  },
  {
    id: "trust-audit",
    title: "Trust Audit Guide",
    file: "/docs/TRUST_AUDIT.md",
    icon: <Lock className="w-4 h-4" />,
    category: "Security"
  },
  {
    id: "sigstore",
    title: "Sigstore & Cosign",
    file: "/docs/sigstore-cosign-docs.md",
    icon: <Shield className="w-4 h-4" />,
    category: "Security"
  },
  {
    id: "env",
    title: "Environment Variables",
    file: "/docs/ENV.md",
    icon: <Key className="w-4 h-4" />,
    category: "Configuration"
  },
  {
    id: "registry",
    title: "Registry Specification",
    file: "/docs/REGISTRY-SPEC.md",
    icon: <FileCode className="w-4 h-4" />,
    category: "Advanced"
  },
  {
    id: "flow",
    title: "Workflow Diagrams",
    file: "/docs/Flow.md",
    icon: <Workflow className="w-4 h-4" />,
    category: "Advanced"
  },
  {
    id: "dagger",
    title: "Dagger Integration",
    file: "/docs/DAGGER.md",
    icon: <Code className="w-4 h-4" />,
    category: "Advanced"
  },
  {
    id: "mcp",
    title: "MCP Integration",
    file: "/docs/MCP.md",
    icon: <FileText className="w-4 h-4" />,
    category: "Advanced"
  },
  {
    id: "roadmap",
    title: "Roadmap",
    file: "/docs/ROADMAP.md",
    icon: <BookOpen className="w-4 h-4" />,
    category: "Project"
  }
];

const Docs = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentDoc = searchParams.get("doc") || "readme";
  const activeSection = docSections.find(s => s.id === currentDoc) || docSections[0];

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(activeSection.file);
        if (!response.ok) throw new Error("Failed to fetch documentation");
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load documentation");
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [activeSection.file]);

  const handleSectionClick = (sectionId: string) => {
    setSearchParams({ doc: sectionId });
  };

  const categories = Array.from(new Set(docSections.map(s => s.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Navigation */}
      <nav className="border-b border-cyan-500/20 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-white/70 hover:text-cyan-400"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center space-x-2">
                <img
                  src="/logo.png"
                  alt="Enact Protocol Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold text-gray-100">Enact Protocol</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.open('https://discord.gg/mMfxvMtHyS', '_blank')}
                variant="ghost"
                size="sm"
                className="hidden md:flex text-white/60 hover:text-cyan-400"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Discord
              </Button>
              <Button
                onClick={() => window.open('https://github.com/EnactProtocol/encat-spec-and-tools', '_blank')}
                variant="outline"
                size="sm"
                className="bg-purple-300 border-purple-400/30 text-cyan-900 hover:bg-purple-400/10"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar and Content Layout */}
      <div className="container mx-auto px-4 sm:px-6 py-8 flex gap-8">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <ScrollArea className="h-[calc(100vh-120px)]">
            <nav className="space-y-6 pr-4">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 px-4">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {docSections
                      .filter(section => section.category === category)
                      .map(section => (
                        <button
                          key={section.id}
                          onClick={() => handleSectionClick(section.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-left ${
                            currentDoc === section.id
                              ? "bg-cyan-500/20 text-cyan-400"
                              : "text-white/70 hover:text-cyan-400 hover:bg-cyan-500/10"
                          }`}
                        >
                          {section.icon}
                          <span className="text-sm">{section.title}</span>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-cyan-500/20 p-8">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-pulse text-cyan-400">Loading documentation...</div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="prose prose-invert max-w-none
                prose-headings:text-cyan-400 prose-headings:font-bold
                prose-p:text-white/90 prose-p:leading-relaxed
                prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-code:text-purple-300 prose-code:bg-purple-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-black/60 prose-pre:border prose-pre:border-cyan-500/30 prose-pre:text-white
                prose-li:text-white/90 prose-li:leading-relaxed
                prose-ul:text-white/90 prose-ol:text-white/90
                prose-blockquote:text-white/80 prose-blockquote:border-cyan-500/50
                prose-td:text-white/90 prose-th:text-cyan-300 prose-th:font-semibold
                prose-hr:border-cyan-500/30
                prose-em:text-white/90
                [&>*]:text-white/90">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </main>

        {/* Mobile Navigation - Floating Button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => {
              const sidebar = document.querySelector('aside');
              sidebar?.classList.toggle('hidden');
            }}
            className="rounded-full w-12 h-12 bg-cyan-500 hover:bg-cyan-600 shadow-lg"
          >
            <FileText className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 bg-black/40 py-8 mt-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-0">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Enact Protocol Logo" width={32} height={32} className="rounded-lg" />
              <span className="text-white font-semibold">Enact Protocol</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('https://discord.gg/mMfxvMtHyS', '_blank')}
                className="text-white/60 hover:text-cyan-400"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Discord
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('https://github.com/EnactProtocol/encat-spec-and-tools', '_blank')}
                className="text-white/60 hover:text-cyan-400"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
            <div className="text-white/60 text-sm text-center">
              © 2025 Enact Protocol Contributors • MIT License
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Docs;
