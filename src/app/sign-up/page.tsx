import { SignUp } from '@clerk/nextjs';
import { FileText, Sparkles, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-reveal">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-6">
            <div className="p-2 bg-primary rounded-lg shadow-sm group-hover:scale-105 transition-transform">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900">Docsy AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-500 text-sm">
            Join thousands of users optimizing their workflows.
          </p>
        </div>

        {/* Clerk SignUp */}
        <div className="bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none border-none p-6',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                formButtonPrimary: 'bg-primary hover:bg-primary/90 text-white font-bold h-11 normal-case shadow-md rounded-lg',
                socialButtonsBlockButton: 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors h-11 rounded-lg',
                socialButtonsBlockButtonText: 'text-gray-600 font-semibold',
                formFieldLabel: 'text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5',
                formFieldInput: 'bg-gray-50 border-gray-100 text-gray-900 focus:border-primary focus:ring-primary/10 h-11 rounded-lg transition-all',
                footerActionLink: 'text-primary hover:text-primary/80 font-bold',
                identityPreviewText: 'text-gray-900',
                identityPreviewEditButtonIcon: 'text-primary',
              },
              variables: {
                colorPrimary: '#3b82f6',
                colorText: '#111827',
                colorBackground: 'white',
                colorInputBackground: '#f9fafb',
                colorInputText: '#111827',
              }
            }}
            fallbackRedirectUrl="/dashboard"
            signInUrl="/sign-in"
          />
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm font-bold text-gray-400 hover:text-primary transition-colors inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}