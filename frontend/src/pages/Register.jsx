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

const registerHighlights = [
  {
    title: "Create your shelf",
    description: "List books you want to sell, trade, or lend in minutes.",
    Icon: Sparkles,
  },
  {
    title: "Stay protected",
    description:
      "Meet up safely with simple profiles and clear exchange details.",
    Icon: ShieldCheck,
  },
  {
    title: "Grow your circle",
    description: "Connect with local readers and keep stories circulating.",
    Icon: Users,
  },
];

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle register logic
    console.log("Register submitted:", formData);
  };

  return (
    <div className="auth-page">
      <main className="auth-shell">
        <section className="auth-intro">
          <div>
            <p className="auth-intro-badge">
              <BookOpen className="auth-intro-badge-icon" />
              Build your reading circle
            </p>
            <h1>Create your BookSwap account.</h1>
            <p>
              Start trading, lending, and selling books with readers around you
              in just a few steps.
            </p>
          </div>

          <div>
            <div className="auth-points">
              {registerHighlights.map(({ title, description, Icon }) => (
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
                <p className="auth-stat-value">1 min</p>
                <p className="auth-stat-label">Quick signup</p>
              </div>
              <div className="auth-stat">
                <p className="auth-stat-value">100%</p>
                <p className="auth-stat-label">Free to start</p>
              </div>
              <div className="auth-stat">
                <p className="auth-stat-value">24/7</p>
                <p className="auth-stat-label">Listings live</p>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <header className="auth-card-header">
            <p className="auth-eyebrow">Sign up</p>
            <h2>Make your account today.</h2>
            <p>Join the community and set up your profile to start swapping.</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="register-name">
                Full Name
              </label>
              <input
                id="register-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="auth-input"
                autoComplete="name"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="register-email">
                Email
              </label>
              <input
                id="register-email"
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
              <label className="auth-label" htmlFor="register-password">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="auth-input"
                autoComplete="new-password"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="register-confirmPassword">
                Confirm Password
              </label>
              <input
                id="register-confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="auth-input"
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="auth-button">
              Create Free Account <ArrowRight size={16} />
            </button>

            <p className="auth-footnote">
              By signing up, you agree to our <a href="#">Terms</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </p>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
