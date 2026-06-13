import type { Metadata } from 'next';
import { Settings } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = { title: 'Settings — Admin' };

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany({ orderBy: { key: 'asc' } });
  const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" /> Site Settings
        </h1>
        <p className="text-muted-foreground mt-1">Configure the alumni portal settings</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <div className="card-base p-6">
          <h2 className="font-heading font-bold text-foreground text-lg mb-5">General Settings</h2>
          <form className="space-y-4" action="/api/admin/settings" method="POST">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Forum Name</label>
                <input name="forum_name" defaultValue={settingsMap['forum_name'] ?? 'Maitbhanga High School Alumni Forum'} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Contact Email</label>
                <input name="contact_email" type="email" defaultValue={settingsMap['contact_email'] ?? ''} className="input-base" placeholder="info@maitbhangaalumni.org" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Annual Membership Fee (৳)</label>
                <input name="annual_membership_fee" type="number" defaultValue={settingsMap['annual_membership_fee'] ?? '500'} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Life Membership Fee (৳)</label>
                <input name="life_membership_fee" type="number" defaultValue={settingsMap['life_membership_fee'] ?? '5000'} className="input-base" />
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="registration_open" defaultChecked={settingsMap['registration_open'] === 'true'} className="accent-primary h-4 w-4" />
                <span className="text-sm font-medium text-foreground">Allow New Registrations</span>
              </label>
            </div>
            <button type="submit" className="btn-primary">Save Settings</button>
          </form>
        </div>

        {/* Current Settings Table */}
        <div className="card-base p-6">
          <h2 className="font-heading font-bold text-foreground text-lg mb-5">All Settings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left py-2 text-muted-foreground font-medium">Key</th><th className="text-left py-2 text-muted-foreground font-medium">Value</th></tr></thead>
              <tbody className="divide-y divide-border/50">
                {settings.map(s => (
                  <tr key={s.key}><td className="py-2 font-mono text-xs text-muted-foreground">{s.key}</td><td className="py-2 text-foreground">{s.value}</td></tr>
                ))}
                {settings.length === 0 && <tr><td colSpan={2} className="py-4 text-center text-muted-foreground">No settings configured yet. Run the database seed.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
