import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Plane, Ship, Truck, Bike, Package, Clock, Globe, ShieldCheck,
  MapPin, CheckCircle2, ArrowRight, Star, Phone, Mail, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import heroImage from '@/assets/hero-logistics.jpg';
import warehouseImg from '@/assets/logistics-warehouse.jpg';
import containersImg from '@/assets/shipping-containers.jpg';
import truckImg from '@/assets/delivery-truck.jpg';
import planeImg from '@/assets/cargo-plane.jpg';
import oceanImg from '@/assets/ocean-shipping.jpg';
import courierImg from '@/assets/delivery-person.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const services = [
  { icon: Plane, title: 'Air Freight', desc: 'Express international air delivery with guaranteed transit times. Ideal for time-sensitive cargo across continents.', img: planeImg },
  { icon: Ship, title: 'Sea Freight', desc: 'Cost-effective ocean shipping for large volumes. Full container and less-than-container-load options available.', img: oceanImg },
  { icon: Truck, title: 'Road Transport', desc: 'Reliable cross-border road logistics with real-time GPS tracking and temperature-controlled options.', img: truckImg },
  { icon: Bike, title: 'Last-Mile Delivery', desc: 'Fast urban courier service ensuring your packages reach the final destination safely and on time.', img: courierImg },
];

const stats = [
  { value: '150+', label: 'Countries Served' },
  { value: '2M+', label: 'Packages Delivered' },
  { value: '99.8%', label: 'On-Time Rate' },
  { value: '24/7', label: 'Customer Support' },
];

const steps = [
  { step: '01', title: 'Book Your Shipment', desc: 'Register your package with us. Provide sender and receiver details, choose your preferred transport mode.' },
  { step: '02', title: 'We Pick Up & Ship', desc: 'Our logistics team collects your package and routes it through our optimized global shipping network.' },
  { step: '03', title: 'Track in Real-Time', desc: 'Use your unique tracking code to monitor your shipment\'s journey with live location updates and timeline events.' },
  { step: '04', title: 'Safe Delivery', desc: 'Your package arrives at its destination. Receive confirmation with proof of delivery photos and signatures.' },
];

const testimonials = [
  { name: 'Sarah Mitchell', role: 'E-commerce Owner, USA', text: 'IntTrack has transformed how I ship products internationally. The real-time tracking gives my customers confidence, and the delivery times are consistently excellent.', rating: 5 },
  { name: 'James Okafor', role: 'Import Manager, Nigeria', text: 'We\'ve been using IntTrack for over two years now. Their sea freight service is unbeatable in terms of cost and reliability. Highly recommended for bulk shipments.', rating: 5 },
  { name: 'Maria Gonzalez', role: 'Logistics Coordinator, Spain', text: 'The customer support team is incredibly responsive. Any issues are resolved within hours. The tracking system is the most detailed I\'ve ever used.', rating: 5 },
];

const faqs = [
  { q: 'How do I track my shipment?', a: 'Simply enter your unique tracking code (e.g., INT-2026-NGUS-08A3B) in the search bar above. You\'ll get real-time updates including current location, timeline events, and estimated delivery date.' },
  { q: 'What shipping methods are available?', a: 'We offer Air Freight for express delivery, Sea Freight for cost-effective bulk shipping, Road Transport for cross-border logistics, and Last-Mile Delivery for urban courier services.' },
  { q: 'How long does international shipping take?', a: 'Transit times vary by method: Air Freight takes 2-5 business days, Sea Freight 15-45 days depending on the route, and Road Transport 3-10 days for regional deliveries.' },
  { q: 'Is my package insured?', a: 'All shipments include basic coverage. You can request additional comprehensive insurance through your tracking page for high-value items.' },
  { q: 'What countries do you deliver to?', a: 'We deliver to over 150 countries worldwide. Our extensive network covers major cities and rural areas across North America, Europe, Asia, Africa, and beyond.' },
];

export default function Index() {
  const [code, setCode] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) navigate(`/track/${code.trim()}`);
  };

  return (
    <main className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Global shipping routes" className="h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary/95" />
        </div>

        <div className="relative z-10 container text-center px-4 py-20">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-sm font-medium bg-accent/20 text-accent border border-accent/30">
              🌍 Trusted by 2M+ customers worldwide
            </span>
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 tracking-tight leading-tight"
          >
            Your Package, <br />
            <span className="text-gradient">Tracked Worldwide</span>
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-primary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Professional international delivery & logistics services. Ship anywhere, track everything — from pickup to doorstep with real-time updates.
          </motion.p>

          <motion.form
            onSubmit={handleTrack}
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
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

          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={4}
            className="mt-8 flex flex-wrap justify-center gap-6 text-primary-foreground/60 text-sm"
          >
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-accent" /> Insured Shipments</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" /> Real-Time Updates</span>
            <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-accent" /> 150+ Countries</span>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-accent text-accent-foreground py-10">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <div className="text-3xl md:text-4xl font-bold">{s.value}</div>
                <div className="text-sm mt-1 opacity-80">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-24 bg-background">
        <div className="container px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Complete Shipping Solutions
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              From express air freight to cost-effective sea shipping, we provide end-to-end logistics solutions tailored to your needs.
            </p>
          </motion.div>

          <div className="space-y-20">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} custom={0}
                className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 items-center`}
              >
                <div className="lg:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img src={s.img} alt={s.title} className="w-full h-72 md:h-96 object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                  </div>
                </div>
                <div className="lg:w-1/2 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                      <s.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">{s.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed">{s.desc}</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0" /> Door-to-door pickup & delivery</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0" /> Real-time GPS tracking</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0" /> Customs clearance assistance</li>
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / Warehouse ── */}
      <section className="py-24 bg-secondary">
        <div className="container px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src={warehouseImg} alt="IntTrack logistics warehouse" className="w-full h-80 md:h-[500px] object-cover" loading="lazy" />
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="lg:w-1/2 space-y-6">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">About IntTrack</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                A Global Network Built for Speed & Reliability
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                IntTrack operates an extensive logistics network spanning over 150 countries. Our state-of-the-art warehouses, advanced routing algorithms, and dedicated fleet ensure your packages travel the fastest, safest path to their destination.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Founded with a mission to make international shipping accessible to everyone, we've grown from a small courier service to a trusted name in global logistics. Whether you're an individual sending a gift overseas or a business shipping thousands of orders monthly, IntTrack delivers.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="rounded-xl bg-card p-4 text-center border border-border">
                  <Package className="h-6 w-6 text-accent mx-auto mb-2" />
                  <div className="font-bold text-foreground">Secure Handling</div>
                  <div className="text-xs text-muted-foreground">Tamper-proof packaging</div>
                </div>
                <div className="rounded-xl bg-card p-4 text-center border border-border">
                  <MapPin className="h-6 w-6 text-accent mx-auto mb-2" />
                  <div className="font-bold text-foreground">Live Tracking</div>
                  <div className="text-xs text-muted-foreground">GPS-enabled updates</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 bg-background">
        <div className="container px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Simple Steps to Ship Anywhere
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="relative text-center p-6"
              >
                <div className="text-5xl font-black text-accent/15 mb-2">{s.step}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-12 -right-4 h-6 w-6 text-accent/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Global Network Image ── */}
      <section className="relative h-80 md:h-[500px]">
        <img src={containersImg} alt="Global shipping container port" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Connecting Businesses Across <span className="text-gradient">Every Continent</span>
            </h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
              Our integrated network of shipping partners, customs agents, and local couriers ensures seamless delivery no matter where your package needs to go.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-secondary">
        <div className="container px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              What Our Customers Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="rounded-2xl bg-card border border-border p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-background">
        <div className="container px-4 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.5}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium text-foreground hover:bg-secondary/50 transition-colors"
                >
                  {f.q}
                  <ArrowRight className={`h-4 w-4 text-accent shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{f.a}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-primary">
        <div className="container px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Ready to Ship Your Package?
            </h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto text-lg mb-8">
              Get started with IntTrack today. Enter your tracking code to follow your shipment, or contact us to arrange a new delivery.
            </p>
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-8">
              <Input
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Enter your tracking code"
                className="h-14 text-base bg-card/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 backdrop-blur-sm"
              />
              <Button type="submit" variant="accent" size="lg" className="h-14 px-8 text-base font-semibold">
                <Search className="h-5 w-5 mr-2" /> Track Now
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-card border-t border-border py-16">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-xl text-foreground">
                <Package className="h-6 w-6 text-accent" />
                <span>Int<span className="text-accent">Track</span></span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional international delivery & logistics services. Trusted by millions of customers worldwide since 2018.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Air Freight</li>
                <li>Sea Freight</li>
                <li>Road Transport</li>
                <li>Last-Mile Delivery</li>
                <li>Warehousing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Careers</li>
                <li>Partner Network</li>
                <li>Press & Media</li>
                <li>Sustainability</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +1 (800) 555-TRACK</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> support@inttrack.com</li>
                <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-accent" /> Live Chat 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-10 pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} IntTrack Global Logistics. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
