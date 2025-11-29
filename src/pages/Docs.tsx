import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Github } from "lucide-react";

const Docs = () => {
  const navigate = useNavigate();

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
            <div className="hidden md:flex items-center space-x-6">
              <a href="#overview" className="text-white/70 hover:text-cyan-400 transition-colors">Overview</a>
              <a href="#spec" className="text-white/70 hover:text-cyan-400 transition-colors">Specification</a>
              <a href="#commands" className="text-white/70 hover:text-cyan-400 transition-colors">Commands</a>
              <a href="#env" className="text-white/70 hover:text-cyan-400 transition-colors">Secrets</a>
              <a href="#sigstore" className="text-white/70 hover:text-cyan-400 transition-colors">Security</a>
              <Button
                onClick={() => window.open('https://github.com/EnactProtocol/encat-spec-and-tools', '_blank')}
                variant="outline"
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
          <nav className="sticky top-24 space-y-2">
            <a
              href="#overview"
              className="block px-4 py-2 rounded-lg text-white/70 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              Overview
            </a>
            <a
              href="#spec"
              className="block px-4 py-2 rounded-lg text-white/70 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              Protocol Specification
            </a>
            <a
              href="#commands"
              className="block px-4 py-2 rounded-lg text-white/70 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              CLI Commands
            </a>
            <a
              href="#env"
              className="block px-4 py-2 rounded-lg text-white/70 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              Secret Management
            </a>
            <a
              href="#sigstore"
              className="block px-4 py-2 rounded-lg text-white/70 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              Sigstore Implementation
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl">
          <div className="prose prose-invert prose-cyan max-w-none">
            {/* Overview Section */}
            <section id="overview" className="mb-16 scroll-mt-24">
              <iframe
                src="/docs/README.md"
                className="w-full min-h-screen border-0 rounded-lg bg-white/5 backdrop-blur-sm"
                title="Enact Protocol Overview"
              />
            </section>

            {/* Specification Section */}
            <section id="spec" className="mb-16 scroll-mt-24">
              <iframe
                src="/docs/SPEC.md"
                className="w-full min-h-screen border-0 rounded-lg bg-white/5 backdrop-blur-sm"
                title="Protocol Specification"
              />
            </section>

            {/* Commands Section */}
            <section id="commands" className="mb-16 scroll-mt-24">
              <iframe
                src="/docs/COMMANDS.md"
                className="w-full min-h-screen border-0 rounded-lg bg-white/5 backdrop-blur-sm"
                title="CLI Commands Reference"
              />
            </section>

            {/* Environment Variables Section */}
            <section id="env" className="mb-16 scroll-mt-24">
              <iframe
                src="/docs/ENV.md"
                className="w-full min-h-screen border-0 rounded-lg bg-white/5 backdrop-blur-sm"
                title="Secret Management"
              />
            </section>

            {/* Sigstore Section */}
            <section id="sigstore" className="mb-16 scroll-mt-24">
              <iframe
                src="/docs/SIGSTORE.md"
                className="w-full min-h-screen border-0 rounded-lg bg-white/5 backdrop-blur-sm"
                title="Sigstore Implementation"
              />
            </section>
          </div>
        </main>
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
