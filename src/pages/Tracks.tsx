import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Server, Layers, Lightbulb, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const tracks = [
  {
    icon: Code2,
    title: "Frontend Development",
    desc: "HTML, CSS, JavaScript, React",
    details: "Master the visual side of the web. Build responsive, interactive user interfaces that delight users and employers alike.",
  },
  {
    icon: Server,
    title: "Backend Development",
    desc: "Node.js, APIs, Databases",
    details: "Learn to build robust server-side applications, RESTful APIs, and work with relational and non-relational databases.",
  },
  {
    icon: Layers,
    title: "Full-Stack Development",
    desc: "Frontend + Backend mastery",
    details: "Combine frontend and backend skills to build complete web applications from concept to deployment.",
  },
  {
    icon: Lightbulb,
    title: "Beginner Tech Foundation",
    desc: "Start from zero",
    details: "No prior experience? Start here. Learn computing fundamentals, logical thinking, and your first lines of code.",
  },
];

const TracksPage = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Layout>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold text-foreground">Choose Your Learning Track</h1>
            <p className="mt-4 text-muted-foreground">
              Select the path that aligns with your goals. You can expand later.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
            {tracks.map((t, i) => {
              const isSelected = selected === t.title;
              return (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${
                    isSelected
                      ? "border-accent bg-accent/5 shadow-md"
                      : "border-border bg-card hover:border-accent/40 hover:shadow-sm"
                  }`}
                  onClick={() => setSelected(t.title)}
                >
                  {isSelected && (
                    <CheckCircle2 className="absolute right-4 top-4 h-6 w-6 text-accent" />
                  )}
                  <t.icon className="h-10 w-10 text-accent" />
                  <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{t.title}</h3>
                  <p className="mt-1 text-sm font-medium text-accent">{t.desc}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.details}</p>
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

export default TracksPage;
