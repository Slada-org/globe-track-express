import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plane, Ship, Truck, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import heroImage from '@/assets/hero-logistics.jpg';

const features = [
  { icon: Plane, title: 'Air Freight', desc: 'Express international air delivery' },
  { icon: Ship, title: 'Sea Freight', desc: 'Cost-effective ocean shipping' },
  { icon: Truck, title: 'Road Transport', desc: 'Cross-border road logistics' },
  { icon: Bike, title: 'Bike Courier', desc: 'Last-mile urban delivery' },
];

export default function Index() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) navigate(`/track/${code.trim()}`);
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Global shipping routes" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary/95" />
        </div>

        <div className="relative z-10 container text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 tracking-tight">
              Track Your Shipment <br />
              <span className="text-gradient">Worldwide</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Professional international delivery tracking. Enter your tracking code below to get real-time updates on your shipment.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleTrack}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <Input
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter tracking code (e.g. INT-2026-NGUS-08A3B)"
              className="h-14 text-base bg-card/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 backdrop-blur-sm"
            />
            <Button type="submit" variant="accent" size="lg" className="h-14 px-8 text-base font-semibold">
              <Search className="h-5 w-5 mr-2" /> Track
            </Button>
          </motion.form>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-foreground">
            Trusted Global Delivery Solutions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="rounded-lg border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                  <f.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
