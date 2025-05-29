
import { ArrowRight, Code, Shield, Search, Package, Zap, Github, MessageCircle, Book, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Custom CSS for floating animation */}
      <style jsx>{`
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
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Enact Protocol</span>
              <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                Alpha
              </Badge>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-white/70 hover:text-cyan-400 transition-colors">Features</a>
              <a href="#examples" className="text-white/70 hover:text-cyan-400 transition-colors">Examples</a>
              <a href="#docs" className="text-white/70 hover:text-cyan-400 transition-colors">Docs</a>
              <Button variant="outline" className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10">
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
              src="/api/placeholder/120/120" 
              alt="Pixelated Globe" 
              className="w-24 h-24 floating opacity-80"
              style={{ filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.3))' }}
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Revolutionize how AI tools are
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> defined</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Enact lets AI models use command-line tools safely and reliably. 
            Transform any CLI tool into an AI tool with just YAML.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-purple-400/30 text-purple-400 hover:bg-purple-400/10">
              <MessageCircle className="w-5 h-5 mr-2" />
              Join Discord
            </Button>
          </div>
          
          {/* Quick Example */}
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20 max-w-2xl mx-auto">
            <div className="text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="text-cyan-400 font-mono text-sm">tool.yaml</span>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                  3 lines!
                </Badge>
              </div>
              <pre className="text-white/90 font-mono text-sm leading-relaxed">
{`name: hello-world
description: "Greets the world"
command: "echo 'Hello, \${name}!'"`}
              </pre>
            </div>
          </div>
          <p className="text-white/60 mt-4 text-sm">
            That's it! This tool can now be discovered, executed, and verified by any AI model.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Enact?</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Built on the Model Context Protocol (MCP) with security and reproducibility at its core
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-400/40 transition-colors">
              <CardHeader>
                <Search className="w-10 h-10 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Discoverable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  Semantically searchable across registries. AI models can find the right tool for any task.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm hover:border-blue-400/40 transition-colors">
              <CardHeader>
                <Package className="w-10 h-10 text-blue-400 mb-2" />
                <CardTitle className="text-white">Packaged</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  Consistent, executable format. Define once, run anywhere with standard YAML configuration.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-colors">
              <CardHeader>
                <Shield className="w-10 h-10 text-purple-400 mb-2" />
                <CardTitle className="text-white">Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  Protected with cryptographic signatures and verification. Trust what you execute.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-yellow-400/20 backdrop-blur-sm hover:border-yellow-400/40 transition-colors">
              <CardHeader>
                <Zap className="w-10 h-10 text-yellow-400 mb-2" />
                <CardTitle className="text-white">Reproducible</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  Versioned with content pinning. Same input, same output, every time.
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
                Create a simple YAML file describing your tool's name, description, and command.
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
                AI models discover and execute your tool safely through the MCP protocol.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section id="examples" className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Progressive Complexity</h2>
            <p className="text-xl text-white/70">
              Start simple, add features as needed
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="bg-black/60 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 mr-3">
                    Level 1
                  </Badge>
                  Minimal Tool
                </CardTitle>
                <CardDescription className="text-white/70">
                  Just 3 required fields to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-white/90 font-mono text-sm leading-relaxed overflow-x-auto">
{`name: SlugifyText
description: "Converts text to URL-friendly slugs"
command: "npx github:sindresorhus/slugify-cli@b4a8c2d9f '\${text}'"`}
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 mr-3">
                    Level 2
                  </Badge>
                  Production Ready
                </CardTitle>
                <CardDescription className="text-white/70">
                  Add validation, metadata, and examples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-white/90 font-mono text-sm leading-relaxed overflow-x-auto">
{`name: MarkdownToHTML
description: "Converts markdown to HTML"
command: "npx github:markdown-it/markdown-it-cli@abc123"
timeout: "30s"
tags: ["markdown", "html", "converter"]

inputSchema:
  type: object
  properties:
    input:
      type: string
      description: "Markdown content"
  required: ["input"]`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-8">Get Started in Minutes</h2>
            
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-cyan-500/20 text-left">
              <div className="flex items-center justify-between mb-6">
                <span className="text-cyan-400 font-mono text-lg">Terminal</span>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                  3 commands
                </Badge>
              </div>
              <pre className="text-white/90 font-mono leading-relaxed">
{`# Install
npm install -g enact-cli

# Create your first tool
enact init my-tool

# Publish it
enact publish tool.yaml`}
              </pre>
              <p className="text-white/60 mt-4 text-center">
                Now any AI using MCP can discover and use your tool!
              </p>
            </div>
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

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Button variant="outline" size="lg" className="border-purple-400/50 text-purple-300 hover:bg-purple-400/20 hover:border-purple-300 h-20 flex-col transition-all duration-300">
              <MessageCircle className="w-6 h-6 mb-2" />
              <span>Discord</span>
            </Button>
            <Button variant="outline" size="lg" className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/20 hover:border-cyan-300 h-20 flex-col transition-all duration-300">
              <Github className="w-6 h-6 mb-2" />
              <span>GitHub</span>
            </Button>
            <Button variant="outline" size="lg" className="border-blue-400/50 text-blue-300 hover:bg-blue-400/20 hover:border-blue-300 h-20 flex-col transition-all duration-300">
              <Book className="w-6 h-6 mb-2" />
              <span>Docs</span>
            </Button>
            <Button variant="outline" size="lg" className="border-yellow-400/50 text-yellow-300 hover:bg-yellow-400/20 hover:border-yellow-300 h-20 flex-col transition-all duration-300">
              <Star className="w-6 h-6 mb-2" />
              <span>Registry</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 bg-black/40 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded"></div>
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
