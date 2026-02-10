import { User, Bell, Lock, Palette, Globe, Shield, ChevronRight, Camera, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";

const SettingsPage = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@livra.com");
  const [phone, setPhone] = useState("+1 234 567 890");
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false });
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account preferences" />

      {/* Profile Section */}
      <div className="glass rounded-2xl p-6 mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Profile</h3>
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
              JD
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <Camera size={12} />
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Notifications */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Bell size={16} /> Notifications</h3>
          <div className="space-y-3">
            {([["email", "Email Notifications", Mail], ["push", "Push Notifications", Bell], ["sms", "SMS Notifications", Phone]] as const).map(([key, label, Icon]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{label}</span>
                </div>
                <button onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                  className={`w-10 h-6 rounded-full transition-colors flex items-center ${notifications[key] ? "bg-primary justify-end" : "bg-muted justify-start"}`}>
                  <div className="w-4 h-4 rounded-full bg-primary-foreground mx-1" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Lock size={16} /> Security</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground">Two-Factor Authentication</span>
              <button onClick={() => setTwoFactor(!twoFactor)}
                className={`w-10 h-6 rounded-full transition-colors flex items-center ${twoFactor ? "bg-primary justify-end" : "bg-muted justify-start"}`}>
                <div className="w-4 h-4 rounded-full bg-primary-foreground mx-1" />
              </button>
            </div>
            <button className="w-full glass py-3 rounded-xl text-sm font-medium text-foreground hover:bg-[hsl(0_0%_100%/0.6)] transition-colors flex items-center justify-between px-4">
              Change Password <ChevronRight size={14} className="text-muted-foreground" />
            </button>
            <button className="w-full glass py-3 rounded-xl text-sm font-medium text-foreground hover:bg-[hsl(0_0%_100%/0.6)] transition-colors flex items-center justify-between px-4">
              Login Activity <ChevronRight size={14} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Globe size={16} /> Preferences</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
              <option>English</option><option>French</option><option>Spanish</option><option>German</option><option>Swahili</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Currency</label>
            <select className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
              <option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
