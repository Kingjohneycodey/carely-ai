import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard, Wallet, Download, ChevronRight } from "lucide-react";

const plans = [
  { name: "Care Basic", price: "₦0", period: "/month", features: ["5 AI symptom checks/month", "Health tips", "Emergency info", "Health records"], popular: false, current: false },
  { name: "Care Plus", price: "₦2,500", period: "/month", features: ["Everything in Basic", "Unlimited AI consults", "2 doctor chat sessions", "Lab result analysis",], popular: true, current: true },
  { name: "Care Pro", price: "₦5,000", period: "/month", features: ["Everything in Plus", "Unlimited doctor access", "Priority support", "Chronic care tracking"], popular: false, current: false },
];

const transactions = [
  { desc: "Care Basic — Monthly", amount: "₦500", date: "Mar 1, 2025", status: "Paid" },
  { desc: "Dr. Adeyemi Consultation", amount: "₦1,500", date: "Feb 28, 2025", status: "Paid" },
  { desc: "Emergency Wallet Top-up", amount: "₦2,000", date: "Feb 15, 2025", status: "Paid" },
  { desc: "Care Basic — Monthly", amount: "₦500", date: "Feb 1, 2025", status: "Paid" },
];

export default function PlansPayments() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Plans & Payments</h1>
        <p className="text-muted-foreground text-sm">Manage your subscription and payment methods</p>
      </div>

      {/* Emergency Wallet */}
      <Card className="bg-accent/50 border-primary/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Emergency Wallet</p>
              <p className="font-display text-xl font-bold">₦5,000</p>
            </div>
          </div>
          <Button size="sm">Top Up</Button>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-2">
        {plans.map(plan => (
          <Card key={plan.name} className={plan.current ? "border-primary ring-1 ring-primary/20 relative overflow-visible" : ""}>
            {plan.current && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[12px] font-semibold px-3 py-1 rounded-full">
                Current Plan
              </span>
            )}
            <CardContent className="p-4 flex flex-col">
              <h3 className="font-display font-semibold">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="font-display text-2xl font-bold">{plan.price}</span>
                <span className="text-xs text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-1.5 flex-1 mb-4">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-1.5 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button variant={plan.current ? "outline" : "hero"} size="sm" className="w-full">
                {plan.current ? "Current" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Methods */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Payment Methods</h3>
            <Button size="sm" variant="outline">Add New</Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">•••• •••• •••• 4532</p>
                  <p className="text-xs text-muted-foreground">Expires 08/26</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">Default</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display font-semibold mb-4">Billing History</h3>
          <div className="space-y-2">
            {transactions.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
                <div>
                  <p className="text-sm font-medium">{t.desc}</p>
                  <p className="text-xs text-muted-foreground">{t.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{t.amount}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
