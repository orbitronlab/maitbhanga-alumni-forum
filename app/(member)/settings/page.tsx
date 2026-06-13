'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Settings, Shield, Bell, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { signOut } from 'next-auth/react';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'password' | 'notifications' | 'account'>('password');

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const currentPassword = data.get('currentPassword') as string;
    const newPassword = data.get('newPassword') as string;
    const confirmPassword = data.get('confirmPassword') as string;
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) });
      if (!res.ok) throw new Error('Failed');
      toast.success('Password changed successfully!');
      form.reset();
    } catch { toast.error('Failed to change password. Check current password.'); }
    finally { setIsLoading(false); }
  };

  const tabs = [
    { key: 'password', icon: Shield, label: 'Password' },
    { key: 'notifications', icon: Bell, label: 'Notifications' },
    { key: 'account', icon: Settings, label: 'Account' },
  ] as const;

  return (
    <div className="pt-16 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold font-heading text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tab sidebar */}
        <div className="card-base p-3 h-fit">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card-base p-6 lg:col-span-3">
          {activeTab === 'password' && (
            <div>
              <h2 className="font-heading font-bold text-foreground text-xl mb-5">Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                {[
                  { name: 'currentPassword', label: 'Current Password' },
                  { name: 'newPassword', label: 'New Password' },
                  { name: 'confirmPassword', label: 'Confirm New Password' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
                    <input name={field.name} type="password" required minLength={8} className="input-base" placeholder="••••••••" />
                  </div>
                ))}
                <button type="submit" disabled={isLoading} className="btn-primary">
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="font-heading font-bold text-foreground text-xl mb-5">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'Email: New announcements', desc: 'Receive emails when new announcements are posted' },
                  { label: 'Email: Event reminders', desc: 'Get reminders before your registered events' },
                  { label: 'Email: Donation receipts', desc: 'Receive receipt emails after donations' },
                  { label: 'Email: Newsletter', desc: 'Monthly alumni newsletter' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary cursor-pointer" />
                  </div>
                ))}
                <button className="btn-primary mt-2">Save Preferences</button>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div>
              <h2 className="font-heading font-bold text-foreground text-xl mb-5">Account Settings</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">Sign Out</h3>
                  <p className="text-red-600 dark:text-red-400 text-sm mb-3">Sign out from all devices</p>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
                    Sign Out
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-muted border border-border">
                  <h3 className="font-semibold text-foreground mb-1">Request Account Deletion</h3>
                  <p className="text-muted-foreground text-sm mb-3">To delete your account, please contact the admin. Your data will be removed within 30 days.</p>
                  <a href="/contact" className="btn-outline text-sm py-2 px-4">Contact Admin</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
