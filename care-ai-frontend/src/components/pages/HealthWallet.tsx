import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, TrendingUp, Download, Share2, FileText, 
  Stethoscope, Pill, TestTube, ChevronRight, Plus,
  CreditCard, ShieldCheck, QrCode, Copy, CheckCircle2,
  Clock, History, LayoutGrid, List as ListIcon, Loader2
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type WalletItem = {
  id: number;
  label: string;
  sub_label: string;
  type: string;
  data: any;
  image_url: string;
};

export default function HealthWallet() {
  const [items, setItems] = useState<WalletItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchWallet = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/health/wallet");
      setItems(response.data);
    } catch (error) {
      toast.error("Failed to load wallet items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
           <div className="h-14 w-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
              <CreditCard className="h-7 w-7" />
           </div>
           <div>
              <h1 className="font-display text-3xl font-bold tracking-tight mb-0.5">Health Wallet</h1>
              <p className="text-muted-foreground text-sm font-medium">Manage your digital health IDs, insurance, and passes</p>
           </div>
        </div>
        <div className="flex gap-3 bg-muted/50 p-1.5 rounded-2xl border border-border">
           <Button 
             variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
             size="icon" 
             className="rounded-xl h-10 w-10"
             onClick={() => setViewMode('grid')}
           >
              <LayoutGrid className="h-4 w-4" />
           </Button>
           <Button 
             variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
             size="icon" 
             className="rounded-xl h-10 w-10"
             onClick={() => setViewMode('list')}
           >
              <ListIcon className="h-4 w-4" />
           </Button>
           <div className="w-px bg-border/50 mx-1" />
           <Button className="rounded-xl gap-2 font-bold px-6 shadow-lg shadow-primary/10">
              <Plus className="h-4 w-4" /> Add Card
           </Button>
        </div>
      </div>

      {/* Wallet Cards Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1, 2, 3].map(i => (
             <div key={i} className="h-56 bg-muted rounded-[32px] animate-pulse" />
           ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center bg-card rounded-[40px] border-2 border-dashed border-border/50">
           <div className="h-20 w-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-10 w-10 text-muted-foreground/30" />
           </div>
           <h3 className="font-display text-2xl font-bold mb-2">No Cards Yet</h3>
           <p className="text-muted-foreground max-w-sm mx-auto mb-8 font-medium">Add your health insurance, blood donor ID, or medical cards for quick access anywhere.</p>
           <Button className="rounded-2xl h-12 px-8 font-bold gap-2">
              <Plus className="h-4 w-4" /> Create Digital Card
           </Button>
        </div>
      ) : (
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {items.map((item) => (
            <Card key={item.id} className="group rounded-[32px] border-none shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20" />
               <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-8">
                     <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                     </div>
                     <Badge variant="outline" className="rounded-lg text-[10px] font-black uppercase tracking-[0.15em] border-primary/20 text-primary">
                        {item.type}
                     </Badge>
                  </div>
                  
                  <div className="mb-8">
                     <h3 className="font-display text-xl font-bold mb-1">{item.label}</h3>
                     <p className="text-muted-foreground text-sm font-medium">{item.sub_label}</p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                     <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/5 hover:text-primary">
                           <QrCode className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/5 hover:text-primary">
                           <Copy className="h-4 w-4" />
                        </Button>
                     </div>
                     <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary group-hover:translate-x-1 transition-transform">
                        Details <ChevronRight className="h-4 w-4 ml-1" />
                     </Button>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Secondary Context / Insights */}
      <div className="grid lg:grid-cols-3 gap-8 pt-8">
         <Card className="lg:col-span-2 rounded-[40px] border-none shadow-lg bg-card overflow-hidden">
            <CardContent className="p-10">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                        <History className="h-6 w-6 text-amber-600" />
                     </div>
                     <h2 className="font-display text-2xl font-bold">Access History</h2>
                  </div>
                  <Button variant="ghost" size="sm" className="font-bold text-muted-foreground">Clear All</Button>
               </div>
               
               <div className="space-y-4">
                  {[
                    { action: "Card Shared", target: "Dr. Adeyemi", time: "2 hours ago", icon: Share2 },
                    { action: "Wallet Exported", target: "Personal Device", time: "Yesterday", icon: Download },
                    { action: "Insurance Verified", target: "City Hospital", time: "3 days ago", icon: CheckCircle2 },
                  ].map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-muted/10 border border-transparent hover:border-border transition-all">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                             <h.icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                             <p className="text-sm font-bold">{h.action}</p>
                             <p className="text-xs text-muted-foreground">{h.target}</p>
                          </div>
                       </div>
                       <span className="text-[11px] font-bold text-muted-foreground uppercase">{h.time}</span>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="rounded-[40px] border-none shadow-xl bg-gradient-to-b from-slate-900 to-slate-800 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
               <ShieldCheck className="h-40 w-40" />
            </div>
            <CardContent className="p-10 relative z-10 flex flex-col h-full">
               <h3 className="font-display text-2xl font-bold mb-4">Secured by Biometrics</h3>
               <p className="text-slate-300 text-[15px] leading-relaxed mb-8 flex-1">Your health wallet is protected by terminal-level encryption and biometric authentication. Safe to store Policy PDFs and ID scans.</p>
               <Button className="w-full h-14 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-base shadow-xl shadow-black/20">
                  Authentication Settings
               </Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

