import { ArrowRight, Code, Shield, Search, Package, Zap, Github, MessageCircle, Book, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TypewriterCode from "@/components/TypewriterCode";

const Index = () => {
  const yamlCode = `enact: 1.0.0
name: hello-world
description: "Greets the world"
from: "alpine:latest"
command: "echo 'Hello, \${name}!'"`;

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
              {/* <a href="#docs" className="text-white/70 hover:text-cyan-400 transition-colors">Docs</a> */}
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
            Enact lets AI models use command-line tools safely in isolated containers. 
            Transform any CLI tool into an AI tool with just YAML.
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
            title="tool.yaml"
            badge="5 lines!"
          />
          <p className="text-white/60 mt-4 text-sm">
            That's it! This tool runs in a secure container and can be discovered, executed, and verified by any AI model.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Enact?</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Built on MCP with Dagger-powered containerized execution for security and reproducibility
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
                <CardTitle className="text-white">Containerized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  Runs in isolated Dagger containers. Reproducible execution with dependency isolation.
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
                AI models discover and execute your tool safely in isolated Dagger containers.
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
                  Just 4 required fields to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-white/90 font-mono text-sm leading-relaxed overflow-x-auto">
{`enact: 1.0.0
name: SlugifyText
description: "Converts text to URL-friendly slugs"
from: "node:18-alpine"
command: "npx slugify-cli@v3.0.0 '\${text}'"`}
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
{`enact: 1.0.0
name: MarkdownToHTML
description: "Converts markdown to HTML"
from: "node:18-alpine"
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

     
      {/* === NEW: Unified Get Started & Registry Section === */}
<section id="quickstart" className="py-20 bg-black/30">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-white mb-4">Enter the Enact Ecosystem</h2>
      <p className="text-xl text-white/70 max-w-2xl mx-auto">
        Whether you want to create new AI tools or use existing ones, you can get started in minutes.
      </p>
    </div>

    {/* Install Section */}
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

    {/* Three-column cards for user paths */}
    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      
      {/* Path 1: For Tool CONSUMERS */}
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
            <p className="whitespace-pre-wrap"><span className="text-purple-400">$</span> enact get tool-name</p>
            <p className="whitespace-pre-wrap"><span className="text-purple-400">$</span> enact exec tool-name --input "data"</p>
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

      {/* Path 2: For MCP SETUP */}
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

      {/* Path 3: For Tool CREATORS */}
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
            Get the Enact CLI to create, validate, and publish your tools. The CLI includes authentication, environment management, MCP integration, and more:
          </p>
          <div className="bg-slate-900/70 rounded-lg p-3 font-mono text-sm text-cyan-300">
            <p className="whitespace-pre-wrap"><span className="text-purple-400">$</span> enact auth login</p>
            <p className="whitespace-pre-wrap"><span className="text-purple-400">$</span> enact init my-awesome-tool</p>
            <p className="whitespace-pre-wrap"><span className="text-purple-400">$</span> enact publish</p>
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
