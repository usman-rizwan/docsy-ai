import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, MessageCircle, Zap, Shield, Upload, Brain } from 'lucide-react';
import { SignedIn, SignedOut, SignInButtonWrapper, SignUpButtonWrapper } from '@/components/auth/auth-wrapper';
// import { useAuth } from "@clerk/clerk-react";


export default function LandingPage() {
  // const { userId, sessionId, getToken, isLoaded, isSignedIn } = useAuth();
  // console.log('userId', userId);
  // console.log('sessionId', sessionId);
  // console.log('isLoaded', isLoaded);
  // console.log('isSignedIn', isSignedIn);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Docsy AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButtonWrapper>
                <Button variant="ghost">Sign In</Button>
              </SignInButtonWrapper>
              <SignUpButtonWrapper>
                <Button>Get Started</Button>
              </SignUpButtonWrapper>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button className=''>Go to Dashboard</Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Transform Your PDFs into
          <span className="text-blue-600"> Conversations</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload any PDF document and start chatting with it instantly. Get answers, insights, and summaries powered by advanced AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SignedOut>
            <SignUpButtonWrapper>
              <Button size="lg" className="text-lg px-8">
                Start Chatting Free
              </Button>
            </SignUpButtonWrapper>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                Go to Dashboard
              </Button>
            </Link>
          </SignedIn>
          {/* <Link href="/dashboard">
            <Button variant="outline" size="lg" className="text-lg px-8">
              View Demo
            </Button>
          </Link> */}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powerful Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
            <p className="text-gray-600">Drag and drop your PDF files or browse to upload. Supports multiple file formats.</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-600">Advanced language models understand your documents and provide accurate responses.</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Natural Chat</h3>
            <p className="text-gray-600">Have natural conversations with your documents. Ask questions in plain English.</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">Docsy AI</span>
          </div>
          <p className="text-center text-gray-600 mt-4">
            © 2025 Docsy AI. Transform your documents into conversations.
          </p>
        </div>
      </footer>
    </div>
  );
}