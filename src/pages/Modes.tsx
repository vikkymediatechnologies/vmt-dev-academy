import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Handshake, Rocket, Layers, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const modes = [
  {
    icon: BookOpen,
    title: "Self-Paced Learning",
    desc: "Work through structured materials at your own speed. Perfect for disciplined, self-motivated learners.",
  },
  {
    icon: Users,
    title: "Live Instructor-Led",
    desc: "Attend scheduled live classes with real-time instruction. Ask questions and get immediate feedback.",
  },
  {
    icon: Handshake,
    title: "Mentorship & Accountability",
    desc: "Get paired with a mentor who checks in regularly, reviews your work, and keeps you on track.",
  },
  {
    icon: Rocket,
    title: "Project-Based Learning",
    desc: "Learn by building. Work on real-world projects that form a portfolio employers actually care about.",
  },
  {
    icon: Layers,
    title: "Hybrid (Self + Mentor)",
    desc: "Combine the flexibility of self-paced learning with the guidance of a dedicated mentor.",
  },
];

const ModesPage = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Layout>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold text-foreground">Select Your Learning Mode</h1>
            <p className="mt-4 text-muted-foreground">
              Choose the level of structure and support you need.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {modes.map((m, i) => {
              const isSelected = selected === m.title;
              return (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`cursor-pointer rounded-xl border-2 p-6 transition-all ${
                    isSelected
                      ? "border-accent bg-accent/5 shadow-md"
                      : "border-border bg-card hover:border-accent/40 hover:shadow-sm"
                  }`}
                  onClick={() => setSelected(m.title)}
                >
                  <div className="flex items-start justify-between">
                    <m.icon className="h-10 w-10 text-accent" />
                    {isSelected && <CheckCircle2 className="h-6 w-6 text-accent" />}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{m.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 text-center"
            >
              <Link to="/onboarding">
                <Button size="lg" variant="secondary">
                  Continue with {selected}
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ModesPage;
