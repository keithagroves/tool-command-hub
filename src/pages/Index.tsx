import { ArrowRight, Code, Shield, Search, Package, Zap, Github, MessageCircle, Book, Star, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import TypewriterCode from "@/components/TypewriterCode";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://xjnhhxwxovjifdxdwzih.supabase.co/functions/v1/email-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Thanks for signing up!",
          description: "We'll keep you updated on Enact Protocol.",
        });
        setEmail("");
      } else {
        toast({
          title: "Signup failed",
          description: data.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: "Unable to connect. Please try again later.",
        variant: "destructive",
      });
    }
  };
  const yamlCode = `---
name: "username/utils/hello-world"
description: "Greets the world"
command: "echo 'Hello, World!'"
---

# Hello World

A simple tool that says hello world.`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Custom CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .floating {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav className="border-b border-cyan-500/20 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="Enact Protocol Logo"
                width={32}
                height={32}
                className="rounded-lg"/>
  
              <span className="text-xl font-bold text-gray-100">Enact Protocol</span>

            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-white/70 hover:text-cyan-400 transition-colors">Features</a>
              <a href="#examples" className="text-white/70 hover:text-cyan-400 transition-colors">Examples</a>
              <a href="/docs" className="text-white/70 hover:text-cyan-400 transition-colors">Docs</a>
              <Button
              onClick={() => window.open('https://github.com/EnactProtocol/encat-spec-and-tools', '_blank')}
              variant="outline" className="bg-purple-300 border-purple-400/30 text-cyan-900 hover:bg-purple-400/10">

                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative">
        <div className="max-w-4xl mx-auto">
          {/* Floating Globe */}
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/67298761-7c4b-41cc-8a98-e8456c3763d0.png" 
              alt="Pixelated Globe" 
              className="w-24 h-24 floating opacity-80"
              style={{ filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.3))' }}
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-6 leading-tight">
            Revolutionize how AI tools are
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> defined</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Enact lets you package, sign, and distribute tools that AI agents can safely discover and execute.
            Build containerized tools or LLM-driven workflows with simple YAML.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">

            <Button onClick={() => {
    document.getElementById('quickstart')?.scrollIntoView({ behavior: 'smooth' });
  }} size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-purple-300 border-purple-400/30 text-cyan-900 hover:bg-purple-400/10"
              onClick={() => window.open('https://discord.gg/mMfxvMtHyS', '_blank')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Join Discord
            </Button>
          </div>
          
          {/* Typewriter YAML Example */}
          <TypewriterCode
            code={yamlCode}
            title="enact.md"
            badge="One file!"
          />
          <p className="text-white/60 mt-4 text-sm">
            That's it! One markdown file with YAML frontmatter. This tool runs in a secure container and can be discovered, executed, and verified by any AI model.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Enact?</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Secure tool execution through cryptographic signatures, semantic search, container isolation, and progressive disclosure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-colors">
              <CardHeader>
                <Shield className="w-10 h-10 text-purple-400 mb-2" />
                <CardTitle className="text-white">Cryptographically Signed</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  Tools verified with Sigstore (Fulcio + Rekor). Multi-party signatures prevent malicious tools with immutable audit trail.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-yellow-400/20 backdrop-blur-sm hover:border-yellow-400/40 transition-colors">
              <CardHeader>
                <Zap className="w-10 h-10 text-yellow-400 mb-2" />
                <CardTitle className="text-white">Container Isolated</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  Runs in isolated Dagger containers with BuildKit caching. Safe, reproducible execution for both code and dependencies.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-400/40 transition-colors">
              <CardHeader>
                <Search className="w-10 h-10 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Semantically Discoverable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  Natural language search vs exact names. AI agents discover tools using descriptions, not just package names.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm hover:border-blue-400/40 transition-colors">
              <CardHeader>
                <Package className="w-10 h-10 text-blue-400 mb-2" />
                <CardTitle className="text-white">Progressive Disclosure</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  Load content on-demand to minimize context usage. Metadata loads at startup, full content only when needed.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-green-500/20 backdrop-blur-sm hover:border-green-400/40 transition-colors">
              <CardHeader>
                <Code className="w-10 h-10 text-green-400 mb-2" />
                <CardTitle className="text-white">Executable & Instructional</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  Add a command field to make tools executable. Without it, tools provide instructions for LLMs to follow.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-orange-500/20 backdrop-blur-sm hover:border-orange-400/40 transition-colors">
              <CardHeader>
                <ArrowRight className="w-10 h-10 text-orange-400 mb-2" />
                <CardTitle className="text-white">Local Development</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  Create tools instantly in ~/.enact/local/ without signing. Publish to registry when ready for public distribution.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-white/70">
              Simple workflow from creation to execution
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Define</h3>
              <p className="text-white/70">
                Create an enact.md file with YAML frontmatter describing your tool's metadata and markdown body for documentation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Publish</h3>
              <p className="text-white/70">
                Use the Enact CLI to validate and publish your tool to the registry.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Execute</h3>
              <p className="text-white/70">
                AI models discover and execute your tool safely in isolated Dagger containers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-File Applications */}
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Full Applications, Not Just Scripts</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Enact tools can be complete multi-file applications with dependencies, tests, and documentation
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-black/60 border-cyan-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Production-Grade Structure</CardTitle>
                  <CardDescription className="text-white/70">
                    Organize your tool like any real application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-white/90 font-mono text-sm leading-relaxed overflow-x-auto">
{`csv-processor/
├── enact.md            # Tool definition & docs
├── src/
│   ├── process.py      # Main entry point
│   ├── validate.py     # Validation logic
│   └── transform.py    # Transform utilities
├── requirements.txt    # Dependencies
└── tests/
    └── test_process.py # Unit tests`}
                  </pre>
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Language Agnostic</CardTitle>
                  <CardDescription className="text-white/70">
                    Use any language or runtime - Python, Node.js, Go, Rust, etc.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <code className="text-cyan-400">from: "python:3.11-slim"</code>
                      <p className="text-white/70 mt-1">Python with pip dependencies</p>
                    </div>
                    <div>
                      <code className="text-cyan-400">from: "node:18-alpine"</code>
                      <p className="text-white/70 mt-1">Node.js with npm packages</p>
                    </div>
                    <div>
                      <code className="text-cyan-400">from: "golang:1.21"</code>
                      <p className="text-white/70 mt-1">Go with modules</p>
                    </div>
                    <div>
                      <code className="text-cyan-400">from: "rust:1.75"</code>
                      <p className="text-white/70 mt-1">Rust with cargo</p>
                    </div>
                    <p className="text-white/60 text-xs mt-4 italic">
                      Any Docker base image works - bring your entire stack
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-black/80 to-black/60 border-blue-500/30 backdrop-blur-sm mt-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Package className="w-6 h-6 mr-3 text-blue-400" />
                  Complete Tool Example
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-sm leading-relaxed overflow-x-auto">
                  <div className="text-purple-400 mb-2">---</div>
                  <div className="mb-1">
                    <span className="text-cyan-400">enact:</span> <span className="text-emerald-300">"1.0.1"</span>
                  </div>
                  <div className="mb-1">
                    <span className="text-cyan-400">name:</span> <span className="text-emerald-300">"acme-corp/data/csv-processor"</span>
                  </div>
                  <div className="mb-1">
                    <span className="text-cyan-400">description:</span> <span className="text-emerald-300">"Process and analyze CSV files"</span>
                  </div>
                  <div className="mb-1">
                    <span className="text-cyan-400">version:</span> <span className="text-emerald-300">"1.2.3"</span>
                  </div>
                  <div className="mb-1">
                    <span className="text-cyan-400">command:</span> <span className="text-emerald-300">"python src/process.py --file='${"$"}{"{"}file{"}"}' --operation='${"$"}{"{"}operation{"}"}'</span>
                  </div>
                  <div className="mb-1">
                    <span className="text-cyan-400">from:</span> <span className="text-emerald-300">"python:3.11-slim"</span>
                  </div>
                  <div className="mb-1">
                    <span className="text-cyan-400">timeout:</span> <span className="text-emerald-300">"2m"</span>
                  </div>
                  <div className="mb-1">
                    <span className="text-cyan-400">license:</span> <span className="text-emerald-300">"MIT"</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-cyan-400">tags:</span> <span className="text-white/70">[</span><span className="text-emerald-300">"csv"</span><span className="text-white/70">, </span><span className="text-emerald-300">"data"</span><span className="text-white/70">, </span><span className="text-emerald-300">"processing"</span><span className="text-white/70">]</span>
                  </div>
                  <div className="text-purple-400 mb-4">---</div>

                  <div className="text-blue-400 text-lg mb-3"># CSV Processor</div>

                  <div className="text-white/80 mb-4">
                    Process and analyze CSV files with validation and transformation.
                  </div>

                  <div className="text-white/80 mb-2">The container will:</div>
                  <div className="text-white/70 mb-1">1. Install dependencies from requirements.txt</div>
                  <div className="text-white/70 mb-1">2. Run your command with parameters</div>
                  <div className="text-white/70 mb-1">3. Return structured output</div>
                  <div className="text-white/70 mb-4">4. Clean up automatically</div>

                  <div className="text-white/70">
                    Your tool can use multiple files, import modules,<br/>
                    run tests, and work exactly like any Python app.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Built-in Security</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Multiple layers of protection ensure you can trust the tools you execute
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-black/60 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <Shield className="w-12 h-12 text-purple-400 mb-2" />
                  <CardTitle className="text-white">Cryptographic Signing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-white/70 space-y-2">
                    <p>Published tools are cryptographically signed with identity-based certificates:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Multi-party signatures via Sigstore (Fulcio + Rekor)</li>
                      <li>Immutable transparency log for audit trail</li>
                      <li>Real-time certificate revocation (CRL)</li>
                      <li>Prevents tool tampering and impersonation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-yellow-500/20 backdrop-blur-sm">
                <CardHeader>
                  <Zap className="w-12 h-12 text-yellow-400 mb-2" />
                  <CardTitle className="text-white">Container Isolation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-white/70 space-y-2">
                    <p>Tools run in isolated Dagger containers for complete separation:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>No access to host filesystem (except mounted dirs)</li>
                      <li>Resource limits enforced (memory, CPU, disk)</li>
                      <li>Network access controlled via annotations</li>
                      <li>Container destroyed after execution</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-black/80 to-black/60 border-green-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Book className="w-6 h-6 mr-3 text-green-400" />
                  Trust Boundaries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <code className="text-green-400">~/.enact/tools/</code>
                    <p className="text-white/70 mt-2">
                      <strong className="text-white">User-level tools.</strong> Tools installed with --global flag. Can be customized locally. No verification needed.
                    </p>
                  </div>
                  <div>
                    <code className="text-blue-400">~/.enact/cache/</code>
                    <p className="text-white/70 mt-2">
                      <strong className="text-white">Verified on download.</strong> Immutable versioned bundles with checked signatures. Auto-managed.
                    </p>
                  </div>
                  <div>
                    <code className="text-purple-400">Registry</code>
                    <p className="text-white/70 mt-2">
                      <strong className="text-white">Public distribution.</strong> All tools signed and logged. Signatures verified before execution.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section id="examples" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Executable & Instructional Tools</h2>
            <p className="text-xl text-white/70">
              Tools with a command field can be executed by Enact in containers. All tools provide instructions, but only executable tools run code through Enact.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            <Card className="bg-black/60 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 mr-3">
                    Executable
                  </Badge>
                </CardTitle>
                <CardDescription className="text-white/70">
                  Has a command field - runs code in isolated containers via Enact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-white/90 font-mono text-sm leading-relaxed overflow-x-auto">
{`---
enact: "1.0.1"
name: "acme-corp/data/csv-processor"
description: "Process and analyze CSV files"
command: "python src/process.py --file='\${file}' --operation='\${operation}'"
from: "python:3.11-slim"
timeout: "2m"
inputSchema:
  type: object
  properties:
    file:
      type: string
      description: "Path to CSV file"
    operation:
      type: string
      enum: ["summarize", "validate"]
  required: ["file", "operation"]
---

# CSV Processor

Deterministic CSV processing in isolated containers.`}
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 mr-3">
                    Instructional
                  </Badge>
                </CardTitle>
                <CardDescription className="text-white/70">
                  No command field - provides instructions for LLMs to interpret
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-white/90 font-mono text-sm leading-relaxed overflow-x-auto">
{`---
enact: "1.0.1"
name: "acme-corp/brand/reviewer"
description: "Review content for brand compliance"
---

# Brand Reviewer

Review content for voice and compliance.

## Process
1. Check tone and voice
2. Verify brand guidelines
3. Suggest improvements

See [BRAND_GUIDE.md](BRAND_GUIDE.md) for details.`}
                </pre>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-white/60 text-sm max-w-3xl mx-auto">
              <strong className="text-white/80">Executable tools</strong> run code through Enact in isolated containers.
              <strong className="text-white/80 ml-4">Instructional tools</strong> provide instructions that LLMs read and interpret.
              Both types support progressive disclosure - metadata loads at startup, full content only when needed.
            </p>
          </div>
        </div>
      </section>

      {/* Local Development Workflow */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Tool Installation Levels</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Install tools project-level (like npm install) or user-level (like npm install -g).
              Develop locally then publish to the registry when ready.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-black/60 border-green-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Project Tools</CardTitle>
                  <code className="text-green-400 text-sm">.enact/</code>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/70">
                    Tools installed for your project. Shared via .enact/tools.json. Team members sync with `enact install`.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-blue-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">User Tools</CardTitle>
                  <code className="text-blue-400 text-sm">~/.enact/tools/</code>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/70">
                    Tools installed globally with --global. Available across all projects. Can be customized locally.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Cache</CardTitle>
                  <code className="text-purple-400 text-sm">~/.enact/cache/</code>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/70">
                    Immutable versioned bundles. Auto-managed. Enables instant reinstall and reproducible builds.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-black/80 to-black/60 border-cyan-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Quick Start Example</CardTitle>
                <CardDescription className="text-white/70">
                  Create and install a tool in seconds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-sm leading-relaxed overflow-x-auto">
                  <div className="mb-3">
                    <span className="text-green-400"># Create a new tool</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-purple-400">$</span> <span className="text-cyan-300">enact init username/utils/greeter</span>
                  </div>

                  <div className="mb-3">
                    <span className="text-green-400"># Edit enact.md with your tool definition</span>
                  </div>
                  <div className="mb-1">
                    <span className="text-purple-400">$</span> <span className="text-cyan-300">cd username-utils-greeter</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-purple-400">$</span> <span className="text-cyan-300">vim enact.md</span>
                  </div>

                  <div className="mb-3">
                    <span className="text-green-400"># Test locally (no install needed)</span>
                  </div>
                  <div className="mb-1">
                    <span className="text-purple-400">$</span> <span className="text-cyan-300">enact run . --args </span><span className="text-yellow-300">'{"{"}"name":"World"{"}"}'</span>
                  </div>
                  <div className="mb-4 text-white/70">
                    Hello, World!
                  </div>

                  <div className="mb-3">
                    <span className="text-green-400"># Install globally when ready</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-purple-400">$</span> <span className="text-cyan-300">enact install . --global</span>
                  </div>

                  <div className="mb-3">
                    <span className="text-green-400"># Run from anywhere</span>
                  </div>
                  <div className="mb-1">
                    <span className="text-purple-400">$</span> <span className="text-cyan-300">enact run username/utils/greeter --args </span><span className="text-yellow-300">'{"{"}"name":"Alice"{"}"}'</span>
                  </div>
                  <div className="text-white/70">
                    Hello, Alice!
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

{/* <section id="quickstart" className="py-20 bg-black/30">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-white mb-4">Enter the Enact Ecosystem</h2>
      <p className="text-xl text-white/70 max-w-2xl mx-auto">
        Whether you want to create new AI tools or use existing ones, you can get started in minutes.
      </p>
    </div>

    <div className="max-w-3xl mx-auto mb-16">
      <Card className="bg-black/60 border-yellow-400/20 backdrop-blur-sm text-center">
        <CardHeader>
          <CardTitle className="text-white text-2xl flex items-center justify-center">
            <Package className="w-6 h-6 mr-3" />
            Install the Enact CLI
          </CardTitle>
          <CardDescription className="text-white/70">
            Get started with the comprehensive Enact command-line interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900/70 rounded-lg p-4 font-mono text-lg text-cyan-300 mb-4">
            <p className="whitespace-pre-wrap"><span className="text-yellow-400">$</span> npm install -g @enactprotocol/cli</p>
          </div>
          <p className="text-white/60 text-sm">
            Includes authentication, tool creation, publishing, discovery, execution, and MCP integration
          </p>
        </CardContent>
      </Card>
    </div>

    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      
      <Card className="bg-black/60 border-cyan-500/20 backdrop-blur-sm text-left flex flex-col">
        <CardHeader>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Search className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-xl">Discover & Use Tools</CardTitle>
              <CardDescription className="text-white/70">
                For AI developers and applications.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-white/80 mb-4">
            Browse the official registry or use the CLI to find and execute tools with semantic search, cryptographic verification, and safe containerized execution.
          </p>
          <div className="bg-slate-900/70 rounded-lg p-3 font-mono text-sm text-cyan-300 mb-4">
            <p className="whitespace-pre-wrap"><span className="text-purple-400">$</span> enact search "text analysis"</p>
            <p className="whitespace-pre-wrap"><span className="text-purple-400">$</span> enact install org/cat/tool</p>
            <p className="whitespace-pre-wrap"><span className="text-purple-400">$</span> enact run org/cat/tool --args '{"{}"}'</p>
          </div>
        </CardContent>
        <div className="p-6 pt-0">
          <Button
            onClick={() => window.open('https://enact.tools', '_blank')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 w-full"
          >
            <Package className="w-5 h-5 mr-2" />
            Explore Registry
          </Button>
        </div>
      </Card>

      <Card className="bg-black/60 border-green-500/20 backdrop-blur-sm text-left flex flex-col">
        <CardHeader>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-xl">Setup with your MCP Client</CardTitle>
              <CardDescription className="text-white/70">
                For AI applications and integrations.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-white/80 mb-4">
            Connect Enact to your favorite AI client with one command. Supports Claude Desktop, VS Code, and more MCP-compatible applications.
          </p>
          <div className="bg-slate-900/70 rounded-lg p-3 font-mono text-sm text-cyan-300 mb-4">
            <p className="whitespace-pre-wrap"><span className="text-purple-400">$</span> enact mcp install --client claude-desktop</p>
            <p className="whitespace-pre-wrap"><span className="text-purple-400">$</span> enact mcp install --client vscode</p>
            <p className="whitespace-pre-wrap"><span className="text-purple-400">$</span> enact mcp status</p>
          </div>
        </CardContent>
        <div className="p-6 pt-0">
          <Button
            variant="outline"
            className="bg-green-500/10 border-green-400/30 text-green-300 hover:bg-green-400/20 w-full"
            onClick={() => window.open('https://github.com/EnactProtocol/encat-spec-and-tools', '_blank')}
          >
            <Book className="w-4 h-4 mr-2" />
            MCP Setup Guide
          </Button>
        </div>
      </Card>

      <Card className="bg-black/60 border-purple-500/20 backdrop-blur-sm text-left flex flex-col">
        <CardHeader>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-xl">Create & Publish Tools</CardTitle>
              <CardDescription className="text-white/70">
                For developers and tool builders.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-white/80 mb-4">
            Get the Enact CLI to create, test, and publish your tools. The CLI includes authentication, environment management, MCP integration, and more:
          </p>
          <div className="bg-slate-900/70 rounded-lg p-3 font-mono text-sm text-cyan-300">
            <p className="whitespace-pre-wrap"><span className="text-purple-400">$</span> enact init my-awesome-tool</p>
            <p className="whitespace-pre-wrap"><span className="text-purple-400">$</span> enact auth login</p>
            <p className="whitespace-pre-wrap"><span className="text-purple-400">$</span> enact publish ./my-awesome-tool/</p>
          </div>
        </CardContent>
        <div className="p-6 pt-0">
           <Button
            variant="outline"
            className="bg-purple-300 border-purple-400/30 text-cyan-900 hover:bg-purple-400/10 w-full"
            onClick={() => window.open('https://github.com/EnactProtocol/encat-spec-and-tools', '_blank')}
          >
            <Book className="w-4 h-4 mr-2" />
            Creator Docs
          </Button>
        </div>
      </Card>
    </div>
    
    <div className="text-center mt-12">
        <p className="text-white/60 mb-4">Want to run your own private registry for your organization?</p>
        <Button
            variant="outline"
            className="bg-black/20 border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
            onClick={() => window.open('https://github.com/EnactProtocol/encat-spec-and-tools', '_blank')}
        >
            <Github className="w-4 h-4 mr-2" />
            Read the Self-Hosting Guide
        </Button>
    </div>
  </div>
</section> */}

      {/* Sign Up Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Be the first to know about new features, tools, and updates to Enact Protocol.
            </p>
            <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/40 border-cyan-500/30 text-white placeholder:text-white/40 focus:border-cyan-400"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 whitespace-nowrap"
              >
                Sign Up
              </Button>
            </form>
            <p className="text-white/50 text-xs mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>


      {/* Community & Links */}
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Join the Community</h2>
            <p className="text-xl text-white/70">
              Connect with developers building the future of AI tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-purple-600 border-purple-400/50 text-cyan-400 hover:bg-purple-400/20 hover:border-purple-300 h-20 flex-col transition-all duration-300"
              onClick={() => window.open('https://discord.gg/mMfxvMtHyS', '_blank')}
            >
              <MessageCircle className="w-6 h-6 mb-2" />
              <span>Discord</span>
            </Button>
            <Button onClick={() => window.open('https://github.com/EnactProtocol/encat-spec-and-tools', '_blank')
            } variant="outline" size="lg" className="bg-purple-600 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/20 hover:border-cyan-300 h-20 flex-col transition-all duration-300">
              <Github className="w-6 h-6 mb-2" />
              <span>GitHub</span>
            </Button>
          
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 bg-black/40 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src="/logo.png" alt="Enact Protocol Logo" width={32} height={32} className="rounded-lg"/>
              <span className="text-white font-semibold">Enact Protocol</span>
            </div>
            <div className="text-white/60 text-sm">
              © 2025 Enact Protocol Contributors • MIT License
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
