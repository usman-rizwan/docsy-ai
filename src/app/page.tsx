import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, MessageCircle, Zap, Shield, Upload, Brain, ArrowRight, Sparkles, Database, Lock } from 'lucide-react';
import { SignedIn, SignedOut, SignInButtonWrapper, SignUpButtonWrapper } from '@/components/auth/auth-wrapper';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Docsy AI</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#security" className="hover:text-primary transition-colors">Security</a>
          </nav>

          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButtonWrapper>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Sign In</Button>
              </SignInButtonWrapper>
              <SignUpButtonWrapper>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-10 px-6 rounded-lg transition-all">
                  Start Free
                </Button>
              </SignUpButtonWrapper>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-10 px-6 rounded-lg">
                  Go to Dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 md:pt-48 md:pb-32">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-8 animate-reveal">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Intelligent PDF Analysis</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 animate-reveal" style={{ animationDelay: '0.1s' }}>
            Your Documents, <br />
            <span className="text-primary">Fully Interactive.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-reveal" style={{ animationDelay: '0.2s' }}>
            The simplest way to analyze, query, and extract insights from your PDF library.
            Docsy AI turns static information into dynamic conversations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-reveal" style={{ animationDelay: '0.3s' }}>
            <SignUpButtonWrapper>
              <Button size="lg" className="h-14 px-10 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 group">
                Begin Free Analysis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SignUpButtonWrapper>
            <Button variant="outline" disabled={true} size="lg" className="h-14 px-10 text-lg font-bold border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-not-allowed">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need</h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">Powerful tools designed to streamline your document workflow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Upload, title: "Rapid Processing", desc: "Drag and drop any PDF. Our engine processes thousands of pages in seconds.", color: "text-blue-500" },
              { icon: Brain, title: "Neural Memory", desc: "Advanced context tracking ensures the AI understands the nuances of your data.", color: "text-indigo-500" },
              { icon: MessageCircle, title: "Natural Dialogue", desc: "Ask questions, generate summaries, or rewrite content in plain language.", color: "text-emerald-500" },
              { icon: Zap, title: "Instant Insights", desc: "Identify key patterns and anomalies in complex technical documents.", color: "text-amber-500" },
              { icon: Lock, title: "Private by Design", desc: "Your data is encrypted and never used for training. Total privacy control.", color: "text-red-500" },
              { icon: Database, title: "Library Search", desc: "Analyze across your entire document library with persistent vector search.", color: "text-purple-500" }
            ].map((feature, idx) => (
              <Card key={idx} className="bg-white border-gray-100 p-8 hover:shadow-md transition-shadow duration-300">
                <div className={cn("h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6", feature.color)}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-emerald-100">
              <Shield className="h-3 w-3" />
              <span>Enterprise Security</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">Your data, <br />strictly confidential.</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              We employ industry-standard encryption and privacy protocols to ensure your sensitive documents remain yours alone.
            </p>
            <Button variant="link" className="text-primary p-0 h-auto font-bold text-lg hover:no-underline hover:text-primary/80">
              Learn about our security <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="md:w-1/12"></div>
          <div className="md:w-5/12 bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-sm font-bold text-gray-900 uppercase tracking-widest">End-to-End Encrypted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-gray-100 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold tracking-tight text-gray-900">Docsy AI</span>
          </div>
          <div className="flex space-x-8 text-sm text-gray-500">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Docsy AI. Built for simple productivity.
          </p>
        </div>
      </footer>
    </div>
  );
}