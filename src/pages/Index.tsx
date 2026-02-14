import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Server,
  Layers,
  Lightbulb,
  BookOpen,
  Users,
  Rocket,
  Handshake,
  CheckCircle2,
  Star,
  Award,
  Briefcase,
} from "lucide-react";
import Layout from "@/components/Layout";
import heroBg from "@/assets/hero-bg.jpg";
import founderAvatar from "@/assets/founder-avatar.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const tracks = [
  { icon: Code2, title: "Frontend Development", desc: "HTML, CSS, JavaScript, React" },
  { icon: Server, title: "Backend Development", desc: "Node.js, APIs, Databases" },
  { icon: Layers, title: "Full-Stack Development", desc: "Frontend + Backend mastery" },
  { icon: Lightbulb, title: "Beginner Tech Foundation", desc: "Start from zero" },
];

const modes = [
  { icon: BookOpen, title: "Self-Paced Learning", desc: "Learn on your own schedule" },
  { icon: Users, title: "Live Instructor-Led", desc: "Real-time classes with a teacher" },
  { icon: Handshake, title: "Mentorship & Accountability", desc: "Guided support and check-ins" },
  { icon: Rocket, title: "Project-Based Learning", desc: "Build real-world projects" },
  { icon: Layers, title: "Hybrid (Self + Mentor)", desc: "Flexibility meets guidance" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 hero-overlay opacity-80" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl md:text-6xl"
          >
            Learn Coding With Structure,
            <br />
            <span className="text-gradient">Guidance, and Real Projects.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/70"
          >
            Stop wandering. Choose your path, prove your discipline, and become a developer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="min-w-[200px] text-base font-semibold">
                Start Free (1-Week Access)
              </Button>
            </Link>

            <Link to="/auth">
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px] border-primary-foreground/30 text-base font-semibold hover:bg-primary-foreground/10"
              >
                Join Paid Program
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========================= */}
      {/* Enhanced Founder Section */}
      {/* ========================= */}

      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-16 md:grid-cols-2">
              
              {/* Image Side */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative flex justify-center"
              >
                <div className="relative">
                  <img
                    src={founderAvatar}
                    alt="Founder"
                    className="h-72 w-72 rounded-2xl object-cover shadow-2xl"
                  />
                  <div className="absolute -bottom-6 -right-6 rounded-xl bg-background p-4 shadow-lg">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Star className="h-4 w-4 text-accent" />
                      Trusted Tech Mentor
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Text Side */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                  Founder & Lead Instructor
                </p>

                <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
                  I Built This For Serious Learners.
                </h2>

                <p className="mt-6 text-muted-foreground leading-relaxed">
                  I created this platform because I was tired of seeing people
                  jump between tutorials without direction. Coding is not about
                  watching videos — it’s about building discipline, shipping
                  projects, and thinking like an engineer.
                </p>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                  This isn’t a bootcamp. It’s structured mentorship designed
                  to transform you into a confident, job-ready developer.
                </p>

                {/* Credentials */}
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-6 w-6 text-accent" />
                    <div>
                      <p className="text-lg font-bold">5+ Years</p>
                      <p className="text-xs text-muted-foreground">Industry Experience</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-accent" />
                    <div>
                      <p className="text-lg font-bold">50+ Students</p>
                      <p className="text-xs text-muted-foreground">Mentored</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Award className="h-6 w-6 text-accent" />
                    <div>
                      <p className="text-lg font-bold">Real Projects</p>
                      <p className="text-xs text-muted-foreground">Portfolio Focused</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent" />
                    <div>
                      <p className="text-lg font-bold">Accountability</p>
                      <p className="text-xs text-muted-foreground">Structured Growth</p>
                    </div>
                  </div>
                </div>

                <Link to="/auth" className="mt-10 inline-block">
                  <Button size="lg">Work With Me</Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Is Different */}
<section className="py-24 bg-background">
  <div className="container mx-auto px-4 text-center max-w-5xl">
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="font-display text-3xl font-bold text-foreground sm:text-4xl"
    >
      Why This Is Different
    </motion.h2>

    <p className="mt-6 text-muted-foreground max-w-3xl mx-auto">
      Most people fail at coding because they lack structure, feedback, and accountability.
      This platform fixes that.
    </p>

    <div className="mt-16 grid gap-8 md:grid-cols-3 text-left">
      {[
        {
          title: "No Random Tutorials",
          desc: "You follow a structured roadmap. Every lesson builds on the previous one.",
        },
        {
          title: "Real Project Execution",
          desc: "You don’t just watch — you build, deploy, and ship real applications.",
        },
        {
          title: "Discipline & Accountability",
          desc: "Deadlines. Feedback. Correction. Growth. You are trained, not entertained.",
        },
      ].map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="rounded-xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-lg text-foreground">
            {item.title}
          </h3>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {item.desc}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Testimonials */}
<section className="py-24 bg-card">
  <div className="container mx-auto px-4 text-center max-w-6xl">
    <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
      What Students Are Saying
    </h2>

    <div className="mt-16 grid gap-8 md:grid-cols-3 text-left">
      {[
        {
          quote:
            "Before this program, I was jumping between YouTube videos. Now I have structure and real projects in my portfolio.",
          name: "Frontend Student",
        },
        {
          quote:
            "The accountability changed everything for me. I stopped procrastinating and started building.",
          name: "Backend Student",
        },
        {
          quote:
            "This feels like real mentorship. Honest feedback. Clear direction. No fluff.",
          name: "Full-Stack Student",
        },
      ].map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="rounded-xl border border-border bg-background p-8 shadow-sm"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            “{t.quote}”
          </p>
          <p className="mt-6 font-semibold text-foreground text-sm">
            — {t.name}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Final CTA */}
<section className="relative py-28 overflow-hidden">
  <div className="absolute inset-0 bg-accent opacity-10" />
  <div className="relative container mx-auto px-4 text-center max-w-3xl">
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="font-display text-3xl font-bold text-foreground sm:text-4xl"
    >
      Ready To Stop Watching Tutorials?
    </motion.h2>

    <p className="mt-6 text-muted-foreground">
      The difference between developers and dreamers is execution.
      Start building. Start growing. Start now.
    </p>

    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <Link to="/auth">
        <Button size="lg" className="min-w-[220px]">
          Start Free (1-Week Access)
        </Button>
      </Link>

      <Link to="/auth">
        <Button size="lg" variant="outline" className="min-w-[220px]">
          Join Paid Program
        </Button>
      </Link>
    </div>
  </div>
</section>


      {/* Tracks Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Learning Tracks
          </h2>
          <p className="mt-3 text-muted-foreground">Choose a path that aligns with your goals.</p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tracks.map((t, i) => (
              <motion.div
                key={t.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="group rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <t.icon className="h-10 w-10 text-accent" />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
