import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Shield, Bell, Download, Trash2, LogOut, Camera, Smartphone, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account, privacy, and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><User className="h-5 w-5" /> Profile & Account</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-xl relative">
              AO
              <button className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <p className="font-medium">Adebayo Okonkwo</p>
              <p className="text-sm text-muted-foreground">adebayo@email.com · +234 801 234 5678</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>First Name</Label><Input defaultValue="Adebayo" /></div>
            <div className="space-y-2"><Label>Last Name</Label><Input defaultValue="Okonkwo" /></div>
            <div className="space-y-2"><Label>Email</Label><Input defaultValue="adebayo@email.com" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+234 801 234 5678" /></div>
          </div>
          <Button className="mt-4" size="sm">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Globe className="h-5 w-5" /> Language</h3>
          <div className="flex flex-wrap gap-2">
            {["English", "Hausa", "Yoruba", "Igbo"].map((lang, i) => (
              <button key={lang} className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${i === 0 ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/30"
                }`}>
                {lang}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Shield className="h-5 w-5" /> Privacy Controls</h3>
          <div className="space-y-4">
            {[
              { label: "AI data use for model improvement", desc: "Allow anonymized data to improve AI accuracy", default: false },
              { label: "Share records with doctors", desc: "Allow doctors to access your health records", default: true },
              { label: "Location services", desc: "Required for Emergency Mode and nearby facilities", default: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.default} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</h3>
          <div className="space-y-4">
            {[
              { label: "Medication reminders", default: true },
              { label: "Appointment alerts", default: true },
              { label: "Health tips", default: true },
              { label: "Promotional messages", default: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="text-sm font-medium">{item.label}</p>
                <Switch defaultChecked={item.default} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Devices */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Smartphone className="h-5 w-5" /> Active Sessions</h3>
          <div className="space-y-3">
            {[
              { device: "iPhone 15 Pro", loc: "Lagos, Nigeria", current: true },
              { device: "Chrome — MacBook Pro", loc: "Lagos, Nigeria", current: false },
            ].map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{d.device}</p>
                  <p className="text-xs text-muted-foreground">{d.loc}</p>
                </div>
                {d.current ? (
                  <span className="text-xs text-success font-medium">Current</span>
                ) : (
                  <Button size="sm" variant="ghost" className="text-xs text-destructive">Revoke</Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-display font-semibold text-destructive">Danger Zone</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export All Data</Button>
            <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
              <Trash2 className="h-4 w-4 mr-1" /> Delete Account
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Account deletion has a 30-day grace period. NDPR Article 3.1 compliant.</p>
        </CardContent>
      </Card>

      <Button variant="ghost" className="text-destructive w-full"><LogOut className="h-4 w-4 mr-1" /> Log Out</Button>
    </div>
  );
}
