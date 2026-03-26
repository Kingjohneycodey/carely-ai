import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, MapPin, Phone, Navigation, X, Shield, Wallet } from "lucide-react";

const hospitals = [
  { name: "Lagos University Teaching Hospital", distance: "2.3 km", time: "8 min", phone: "+234 1 774 0240" },
  { name: "Reddington Hospital", distance: "4.1 km", time: "14 min", phone: "+234 1 271 8888" },
  { name: "Lagoon Hospital", distance: "5.8 km", time: "18 min", phone: "+234 1 460 2000" },
];

export default function EmergencyMode() {
  const [activated, setActivated] = useState(false);
  const [countdown, setCountdown] = useState(10);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Emergency Mode</h1>
        <p className="text-muted-foreground text-sm">One-tap SOS with hospital routing and contact alerts</p>
      </div>

      {!activated ? (
        <div className="flex flex-col items-center py-12 space-y-8">
          {/* SOS Button */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emergency/20 animate-pulse-ring" />
            <button
              onClick={() => setActivated(true)}
              className="relative h-40 w-40 rounded-full bg-emergency text-emergency-foreground flex flex-col items-center justify-center shadow-lg hover:bg-emergency/90 transition-colors"
            >
              <AlertTriangle className="h-12 w-12 mb-2" />
              <span className="font-display text-xl font-bold">SOS</span>
            </button>
          </div>
          <p className="text-center text-sm text-muted-foreground max-w-xs">
            Press the SOS button to activate Emergency Mode. A 10-second countdown will begin before alerts are sent.
          </p>

          {/* Emergency Contacts Preview */}
          <Card className="w-full">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3">Your Emergency Contacts</h3>
              <div className="space-y-2">
                {["Ngozi Okonkwo (Spouse)", "Dr. Emeka (Family Doctor)", "Chidera Okonkwo (Brother)"].map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-sm">{c}</span>
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Wallet */}
          <Card className="w-full">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Emergency Wallet</p>
                  <p className="text-xs text-muted-foreground">Balance: ₦5,000</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Top Up</Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Emergency */}
          <Card className="border-emergency bg-emergency/5">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-emergency mx-auto mb-3" />
              <h2 className="font-display text-xl font-bold text-emergency mb-2">Emergency Mode Active</h2>
              <p className="text-sm text-muted-foreground mb-4">Alerts sent to 3 emergency contacts with your GPS location</p>
              <Button variant="outline" onClick={() => setActivated(false)}>
                <X className="h-4 w-4 mr-1" /> Cancel Emergency
              </Button>
            </CardContent>
          </Card>

          {/* Nearest Hospitals */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Nearest Hospitals
              </h3>
              <div className="space-y-3">
                {hospitals.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">{h.name}</p>
                      <p className="text-xs text-muted-foreground">{h.distance} · {h.time} drive</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" className="h-8 w-8"><Phone className="h-4 w-4" /></Button>
                      <Button size="icon" variant="hero" className="h-8 w-8"><Navigation className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
