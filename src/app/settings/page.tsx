'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Database,
  Trash2,
  Download,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Fingerprint,
  Settings,
  Mail,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <AppLayout>
      <div className="p-8 md:p-12 max-w-4xl mx-auto space-y-10 animate-reveal">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-primary">
            <Settings className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Preferences</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-gray-500 text-lg">Manage your profile, notifications, and security settings.</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="bg-white border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center space-x-3 mb-1">
                <User className="h-5 w-5 text-gray-400" />
                <CardTitle className="text-xl font-bold text-gray-900">Personal Information</CardTitle>
              </div>
              <CardDescription>Update your basic identity and communication details.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-bold text-gray-400 uppercase tracking-widest">First Name</Label>
                  <Input id="firstName" defaultValue={user?.firstName || ''} className="h-11 bg-gray-50/50 border-gray-100 rounded-lg focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Name</Label>
                  <Input id="lastName" defaultValue={user?.lastName || ''} className="h-11 bg-gray-50/50 border-gray-100 rounded-lg focus:ring-primary/20" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" defaultValue={user?.emailAddresses[0]?.emailAddress || ''} className="pl-10 h-11 bg-gray-50/50 border-gray-100 rounded-lg focus:ring-primary/20" />
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-8 rounded-lg">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card className="bg-white border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center space-x-3 mb-1">
                <Bell className="h-5 w-5 text-gray-400" />
                <CardTitle className="text-xl font-bold text-gray-900">Notifications</CardTitle>
              </div>
              <CardDescription>Configure how you want to be alerted about your activity.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-4">
              {[
                { id: 'n1', label: 'Processing Alerts', desc: 'Notify me when document analysis is complete.' },
                { id: 'n2', label: 'Newsletter', desc: 'Receive weekly updates about new AI features.' },
                { id: 'n3', label: 'Security Alerts', desc: 'Critical alerts about your account access.' }
              ].map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="space-y-0.5">
                    <Label htmlFor={item.id} className="text-sm font-bold text-gray-800">{item.label}</Label>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <Switch id={item.id} defaultChecked={idx !== 1} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Data & Security */}
          <Card className="bg-white border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center space-x-3 mb-1">
                <Database className="h-5 w-5 text-gray-400" />
                <CardTitle className="text-xl font-bold text-gray-900">Data & Storage</CardTitle>
              </div>
              <CardDescription>Monitor your usage and export your information.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Usage Limit</span>
                  <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold">24% Used</Badge>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[24%]" />
                </div>
                <p className="text-xs text-gray-500 italic">2.4 GB of 10.0 GB storage currently utilized.</p>
              </div>

              <Separator className="bg-gray-100" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-gray-800">Export Library</h4>
                  <p className="text-xs text-gray-500">Download all your chat history and documents in a ZIP file.</p>
                </div>
                <Button variant="outline" size="sm" className="h-9 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 px-4">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-white border-red-100 shadow-sm rounded-2xl">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center space-x-3 mb-1">
                <Trash2 className="h-5 w-5 text-red-500" />
                <CardTitle className="text-xl font-bold text-red-500">Danger Zone</CardTitle>
              </div>
              <CardDescription className="text-red-400">Irreversible actions that affect your entire workspace.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50/30 rounded-xl border border-red-50">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-red-700">Clear All History</h4>
                  <p className="text-xs text-red-500/70">Permently delete all messages and conversations.</p>
                </div>
                <Button variant="outline" size="sm" className="h-9 border-red-200 text-red-600 hover:bg-red-50 font-bold px-4">
                  Clear Data
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50/30 rounded-xl border border-red-50">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-red-700">Deactivate Account</h4>
                  <p className="text-xs text-red-500/70">Close your account and delete all associated files.</p>
                </div>
                <Button variant="destructive" size="sm" className="h-9 font-bold px-4 bg-red-600 hover:bg-red-700">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}