import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <h3 className="font-display text-lg font-bold">CodeMastery</h3>
          <p className="mt-2 text-sm opacity-70">
            Structured coding education for serious learners. No shortcuts, just results.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-60">Platform</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/tracks" className="hover:opacity-100 transition-opacity">Learning Tracks</Link></li>
            <li><Link to="/modes" className="hover:opacity-100 transition-opacity">Learning Modes</Link></li>
            <li><Link to="/onboarding" className="hover:opacity-100 transition-opacity">Get Started</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-60">Legal</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><span className="cursor-default">Terms of Service</span></li>
            <li><span className="cursor-default">Privacy Policy</span></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-60">Contact</h4>
          <p className="text-sm opacity-80">vikkymediatechnologies@gmail.com</p>
        </div>
      </div>

      <div className="mt-10 border-t border-primary-foreground/20 pt-6 text-center text-xs opacity-50">
        © 2026 CodeMastery. Independent Educator.
      </div>
    </div>
  </footer>
);

export default Footer;
