import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Auth.css";

const loginHighlights = [
  {
    title: "Fast access",
    description: "Jump back into your saved searches and active swaps.",
    Icon: Sparkles,
  },
  {
    title: "Trusted exchanges",
    description: "Stay in control with clear profiles and safe handoffs.",
    Icon: ShieldCheck,
  },
  {
    title: "Community shelf",
    description: "See what nearby readers are listing, trading, and lending.",
    Icon: Users,
  },
];

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle login logic
    console.log("Login submitted:", formData);
  };

  return (
    <div className="auth-page">
      <main className="auth-shell">
        <section className="auth-intro">
          <div>
            <p className="auth-intro-badge">
              <BookOpen className="auth-intro-badge-icon" />
              Reconnect with your shelf
            </p>
            <h1>Welcome back to BookSwap.</h1>
            <p>
              Continue where you left off, check new listings, and keep your
              books moving through the community.
            </p>
          </div>

          <div>
            <div className="auth-points">
              {loginHighlights.map(({ title, description, Icon }) => (
                <div key={title} className="auth-point">
                  <Icon className="auth-point-icon" />
                  <div>
                    <strong>{title}</strong>
                    <span>{description}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="auth-stats">
              <div className="auth-stat">
                <p className="auth-stat-value">50k+</p>
                <p className="auth-stat-label">Active readers</p>
              </div>
              <div className="auth-stat">
                <p className="auth-stat-value">220k+</p>
                <p className="auth-stat-label">Books shared</p>
              </div>
              <div className="auth-stat">
                <p className="auth-stat-value">130+</p>
                <p className="auth-stat-label">Connected cities</p>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <header className="auth-card-header">
            <p className="auth-eyebrow">Sign in</p>
            <h2>Access your account.</h2>
            <p>Use the email and password tied to your BookSwap profile.</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="auth-input"
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label className="auth-label" htmlFor="login-password">
                  Password
                </label>
                <a href="#" className="auth-hint-link">
                  Forgot password?
                </a>
              </div>
              <input
                id="login-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="auth-input"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="auth-button">
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/register">Sign up free</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
