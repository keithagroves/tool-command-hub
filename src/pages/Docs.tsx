import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, FileText, Shield, Terminal, Key, Lock, BookOpen, Code, Workflow, FileCode, ChevronRight, ChevronLeft, Menu, Copy, Check } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import "highlight.js/styles/github-dark.css";

interface DocSection {
  id: string;
  title: string;
  file: string;
  icon: React.ReactNode;
  category: string;
  description?: string;
}

const docSections: DocSection[] = [
  // Getting Started
  {
    id: "readme",
    title: "Introduction",
    file: "/docs/README.md",
    icon: <BookOpen className="w-4 h-4" />,
    category: "Getting Started",
    description: "What is Enact Protocol"
  },
  // Usage
  {
    id: "commands",
    title: "CLI Commands",
    file: "/docs/COMMANDS.md",
    icon: <Terminal className="w-4 h-4" />,
    category: "Usage",
    description: "Command line reference"
  },
  {
    id: "api",
    title: "API Reference",
    file: "/docs/API.md",
    icon: <Code className="w-4 h-4" />,
    category: "Usage",
    description: "Programmatic API docs"
  },
  {
    id: "env",
    title: "Environment Variables",
    file: "/docs/ENV.md",
    icon: <Key className="w-4 h-4" />,
    category: "Usage",
    description: "Configuration and secrets"
  },
  // Architecture
  {
    id: "spec",
    title: "Protocol Specification",
    file: "/docs/SPEC.md",
    icon: <FileText className="w-4 h-4" />,
    category: "Architecture",
    description: "Core protocol design"
  },
  {
    id: "registry",
    title: "Registry Specification",
    file: "/docs/REGISTRY-SPEC.md",
    icon: <FileCode className="w-4 h-4" />,
    category: "Architecture",
    description: "Registry API design"
  },
  {
    id: "flow",
    title: "Workflow Diagrams",
    file: "/docs/Flow.md",
    icon: <Workflow className="w-4 h-4" />,
    category: "Architecture",
    description: "Visual system flows"
  },
  // Security
  {
    id: "trust",
    title: "Trust System",
    file: "/docs/TRUST.md",
    icon: <Shield className="w-4 h-4" />,
    category: "Security",
    description: "Trust model overview"
  },
  {
    id: "trust-audit",
    title: "Trust Audit Guide",
    file: "/docs/TRUST_AUDIT.md",
    icon: <Lock className="w-4 h-4" />,
    category: "Security",
    description: "How to audit tools"
  },
  {
    id: "sigstore",
    title: "Sigstore & Cosign",
    file: "/docs/sigstore-cosign-docs.md",
    icon: <Shield className="w-4 h-4" />,
    category: "Security",
    description: "Cryptographic signing"
  },
  // Integrations
  {
    id: "dagger",
    title: "Dagger Integration",
    file: "/docs/DAGGER.md",
    icon: <Code className="w-4 h-4" />,
    category: "Integrations",
    description: "Container execution"
  },
  {
    id: "mcp",
    title: "MCP Integration",
    file: "/docs/MCP.md",
    icon: <FileText className="w-4 h-4" />,
    category: "Integrations",
    description: "Model Context Protocol"
  },
  // Project
  {
    id: "roadmap",
    title: "Roadmap",
    file: "/docs/ROADMAP.md",
    icon: <BookOpen className="w-4 h-4" />,
    category: "Project",
    description: "Future plans"
  }
];

interface TocItem {
  id: string;
  text: string;
  level: number;
}

// Helper to generate consistent slug IDs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper to extract text from React children (handles nested elements)
function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }
  if (children && typeof children === 'object' && 'props' in children) {
    return extractTextFromChildren((children as React.ReactElement).props.children);
  }
  return '';
}

// Extract headings from markdown content
function extractHeadings(markdown: string): TocItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/\*\*/g, '').replace(/`/g, '');
    const id = slugify(text);
    headings.push({ id, text, level });
  }

  return headings;
}

// Custom code block component with copy button
function CodeBlock({ children, className, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const codeContent = String(children).replace(/\n$/, '');
  const language = className?.replace('language-', '') || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {language && (
        <div className="absolute top-0 right-12 px-2 py-1 text-xs text-cyan-400 bg-black/40 rounded-bl">
          {language}
        </div>
      )}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded bg-white/10 hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-white/70" />
        )}
      </button>
      <code className={className} {...props}>
        {children}
      </code>
    </div>
  );
}

// Sidebar navigation component
function DocsSidebar({
  categories,
  docSections,
  currentDoc,
  onSectionClick
}: {
  categories: string[];
  docSections: DocSection[];
  currentDoc: string;
  onSectionClick: (id: string) => void;
}) {
  return (
    <nav className="space-y-6 pr-4">
      {categories.map(category => (
        <div key={category}>
          <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3 px-4">
            {category}
          </h3>
          <div className="space-y-1">
            {docSections
              .filter(section => section.category === category)
              .map(section => (
                <button
                  key={section.id}
                  onClick={() => onSectionClick(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-left ${
                    currentDoc === section.id
                      ? "bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-400"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className={currentDoc === section.id ? "text-cyan-400" : "text-white/50"}>
                    {section.icon}
                  </span>
                  <span className="text-sm font-medium">{section.title}</span>
                </button>
              ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

// Table of Contents component - Fixed position on right side
function TableOfContents({ headings, activeId, isCollapsed, onToggle }: { headings: TocItem[]; activeId: string; isCollapsed: boolean; onToggle: () => void }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="fixed top-24 right-6 z-40 hidden xl:block">
      {/* Collapsed state - small floating button */}
      <div
        className={`transition-all duration-300 ease-out ${
          isCollapsed ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-white/10 shadow-lg backdrop-blur-sm transition-colors group"
          title="Show table of contents"
        >
          <ChevronLeft className="w-5 h-5 text-white/50 group-hover:text-cyan-400 transition-colors" />
        </button>
      </div>

      {/* Expanded state - full TOC panel */}
      <div
        className={`absolute top-0 right-0 w-56 bg-slate-900/95 backdrop-blur-sm rounded-lg border border-white/10 shadow-xl p-4 transition-all duration-300 ease-out ${
          isCollapsed ? 'opacity-0 translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            On this page
          </h4>
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-6 h-6 rounded hover:bg-white/10 transition-colors group"
            title="Hide table of contents"
          >
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
          </button>
        </div>
        {headings.length > 0 && (
          <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
            {headings.slice(0, 20).map((heading, index) => (
              <a
                key={`${heading.id}-${index}`}
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={`block text-sm py-1.5 transition-colors border-l-2 ${
                  heading.level === 1 ? 'pl-3' : heading.level === 2 ? 'pl-5' : 'pl-7'
                } ${
                  activeId === heading.id
                    ? 'text-cyan-400 border-cyan-400'
                    : 'text-white/50 hover:text-white/80 border-transparent hover:border-white/30'
                }`}
              >
                {heading.text.length > 30 ? heading.text.slice(0, 30) + '...' : heading.text}
              </a>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

const Docs = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isTocCollapsed, setIsTocCollapsed] = useState(false);

  const currentDoc = searchParams.get("doc") || "readme";
  const activeSection = docSections.find(s => s.id === currentDoc) || docSections[0];
  const currentIndex = docSections.findIndex(s => s.id === currentDoc);
  const prevDoc = currentIndex > 0 ? docSections[currentIndex - 1] : null;
  const nextDoc = currentIndex < docSections.length - 1 ? docSections[currentIndex + 1] : null;

  const headings = useMemo(() => extractHeadings(content), [content]);
  const categories = useMemo(() =>
    Array.from(new Set(docSections.map(s => s.category))),
    []
  );

  useEffect(() => {
    const fetchDoc = async () => {
      // Start fade out transition
      setIsTransitioning(true);

      // Wait for fade out
      await new Promise(resolve => setTimeout(resolve, 150));

      setLoading(true);
      setError(null);
      // Scroll to top immediately when switching docs
      window.scrollTo({ top: 0, behavior: 'instant' });

      try {
        const response = await fetch(activeSection.file);
        if (!response.ok) throw new Error("Failed to fetch documentation");
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load documentation");
      } finally {
        setLoading(false);
        // Start fade in transition
        setTimeout(() => setIsTransitioning(false), 50);
      }
    };

    fetchDoc();
  }, [activeSection.file]);

  // Track active heading for TOC highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    const headingElements = document.querySelectorAll('h1[id], h2[id], h3[id]');
    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [content]);

  const handleSectionClick = (sectionId: string) => {
    setSearchParams({ doc: sectionId });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Navigation */}
      <nav className="border-b border-cyan-500/20 bg-black/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden text-white/70">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-slate-950 border-cyan-500/20 p-0">
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-8">
                      <img
                        src="/logo.png"
                        alt="Enact Protocol Logo"
                        width={32}
                        height={32}
                        className="rounded-lg"
                      />
                      <span className="text-lg font-bold text-white">Documentation</span>
                    </div>
                    <ScrollArea className="h-[calc(100vh-120px)]">
                      <DocsSidebar
                        categories={categories}
                        docSections={docSections}
                        currentDoc={currentDoc}
                        onSectionClick={handleSectionClick}
                      />
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-white/70 hover:text-cyan-400"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>

              <div className="hidden sm:flex items-center space-x-2">
                <img
                  src="/logo.png"
                  alt="Enact Protocol Logo"
                  width={28}
                  height={28}
                  className="rounded-lg"
                />
                <span className="text-lg font-bold text-white">Docs</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => window.open('https://discord.gg/mMfxvMtHyS', '_blank')}
                variant="ghost"
                size="sm"
                className="hidden sm:flex text-white/60 hover:text-cyan-400"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => window.open('https://github.com/EnactProtocol/encat-spec-and-tools', '_blank')}
                variant="outline"
                size="sm"
                className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
              >
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="border-b border-white/5 bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center text-sm text-white/50">
            <span>Docs</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white/70">{activeSection.category}</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-cyan-400">{activeSection.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <ScrollArea className="h-[calc(100vh-140px)]">
                <DocsSidebar
                  categories={categories}
                  docSections={docSections}
                  currentDoc={currentDoc}
                  onSectionClick={handleSectionClick}
                />
              </ScrollArea>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <div className={`transition-all duration-300 ${isTocCollapsed ? '' : 'xl:mr-72'}`}>
              {/* Document Header */}
              <div
                className={`mb-8 transition-all duration-300 ease-out ${
                  isTransitioning ? 'opacity-0 -translate-x-2' : 'opacity-100 translate-x-0'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-cyan-400">{activeSection.icon}</span>
                  <h1 className="text-3xl font-bold text-white">{activeSection.title}</h1>
                </div>
                {activeSection.description && (
                  <p className="text-white/60">{activeSection.description}</p>
                )}
              </div>

              {/* Content */}
              <div
                className={`bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 sm:p-8 min-h-[60vh] transition-all duration-300 ease-out ${
                  isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}
              >
                {loading && (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-white/60">Loading documentation...</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                    {error}
                  </div>
                )}

                {!loading && !error && content && (
                  <article className="prose prose-invert prose-lg max-w-none
                    prose-headings:text-white prose-headings:font-bold prose-headings:scroll-mt-24
                    prose-h1:text-3xl prose-h1:text-cyan-400 prose-h1:border-b prose-h1:border-cyan-500/20 prose-h1:pb-4 prose-h1:mb-6
                    prose-h2:text-2xl prose-h2:text-cyan-300 prose-h2:mt-12 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:text-white prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-white/85 prose-p:leading-relaxed
                    prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white prose-strong:font-semibold
                    prose-code:text-purple-300 prose-code:bg-purple-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:p-0 prose-pre:overflow-hidden
                    prose-li:text-white/85 prose-li:leading-relaxed prose-li:marker:text-cyan-500
                    prose-ul:text-white/85 prose-ol:text-white/85
                    prose-blockquote:text-white/70 prose-blockquote:border-cyan-500/50 prose-blockquote:bg-cyan-500/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1
                    prose-table:border-collapse
                    prose-th:text-cyan-300 prose-th:font-semibold prose-th:bg-white/5 prose-th:px-4 prose-th:py-2 prose-th:border prose-th:border-white/10
                    prose-td:text-white/80 prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-white/10
                    prose-hr:border-white/10 prose-hr:my-8
                    prose-em:text-white/80
                    prose-img:rounded-lg prose-img:border prose-img:border-white/10"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        code: ({ node, className, children, ...props }) => {
                          const isInline = !className;
                          if (isInline) {
                            return <code className={className} {...props}>{children}</code>;
                          }
                          return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
                        },
                        h1: ({ children, ...props }) => {
                          const text = extractTextFromChildren(children);
                          const id = slugify(text);
                          return <h1 id={id} {...props}>{children}</h1>;
                        },
                        h2: ({ children, ...props }) => {
                          const text = extractTextFromChildren(children);
                          const id = slugify(text);
                          return <h2 id={id} {...props}>{children}</h2>;
                        },
                        h3: ({ children, ...props }) => {
                          const text = extractTextFromChildren(children);
                          const id = slugify(text);
                          return <h3 id={id} {...props}>{children}</h3>;
                        },
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  </article>
                )}
              </div>

              {/* Prev/Next Navigation */}
              <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10">
                {prevDoc ? (
                  <button
                    onClick={() => handleSectionClick(prevDoc.id)}
                    className="flex items-center space-x-2 text-white/60 hover:text-cyan-400 transition-colors group"
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <div className="text-left">
                      <div className="text-xs uppercase tracking-wider text-white/40">Previous</div>
                      <div className="font-medium">{prevDoc.title}</div>
                    </div>
                  </button>
                ) : <div />}

                {nextDoc ? (
                  <button
                    onClick={() => handleSectionClick(nextDoc.id)}
                    className="flex items-center space-x-2 text-white/60 hover:text-cyan-400 transition-colors group text-right"
                  >
                    <div>
                      <div className="text-xs uppercase tracking-wider text-white/40">Next</div>
                      <div className="font-medium">{nextDoc.title}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : <div />}
              </div>
            </div>
          </main>

          </div>
      </div>

      {/* Table of Contents - Fixed position */}
      <TableOfContents
        headings={headings}
        activeId={activeHeadingId}
        isCollapsed={isTocCollapsed}
        onToggle={() => setIsTocCollapsed(!isTocCollapsed)}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 py-8 mt-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Enact Protocol Logo" width={24} height={24} className="rounded" />
              <span className="text-white/60 text-sm">Enact Protocol</span>
            </div>
            <div className="text-white/40 text-sm">
              © 2025 Enact Protocol Contributors
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Docs;
