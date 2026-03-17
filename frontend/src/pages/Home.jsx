import {
  ArrowRight,
  BookmarkCheck,
  BookOpen,
  Facebook,
  Instagram,
  Leaf,
  MapPin,
  Repeat2,
  Search,
  ShieldCheck,
  ShoppingCart,
  Twitter,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Home.css";

const features = [
  {
    title: "Buy & Sell",
    description:
      "Find great prices on pre-loved books and list your finished reads in minutes.",
    Icon: ShoppingCart,
    tone: "sun",
  },
  {
    title: "Trade & Lend",
    description:
      "Swap titles with nearby readers or lend safely to trusted community members.",
    Icon: Repeat2,
    tone: "mint",
  },
  {
    title: "Reader Community",
    description:
      "Join local readers, discover recommendations, and keep books in circulation.",
    Icon: Users,
    tone: "ocean",
  },
];

const journey = [
  {
    title: "Search your next story",
    description:
      "Discover books by title, author, or ISBN and compare options from nearby readers.",
    Icon: Search,
  },
  {
    title: "Secure your exchange",
    description:
      "Chat, agree, and schedule handoffs with simple safeguards and transparent profiles.",
    Icon: ShieldCheck,
  },
  {
    title: "Keep stories moving",
    description:
      "Once finished, relist books in a click and grow a shelf that never stops giving.",
    Icon: BookmarkCheck,
  },
];

function Home() {
  return (
    <div className="home-page">
      <div className="home-orb home-orb-left" aria-hidden="true" />
      <div className="home-orb home-orb-right" aria-hidden="true" />

      <main className="home-main">
        <section className="hero-panel">
          <div className="hero-copy reveal-up">
            <p className="home-tagline">
              <BookOpen className="home-tagline-icon" />
              REUSE . READ . REPEAT
            </p>

            <h1 className="home-title">
              Give Every Book a <span>Second Life</span> in Your City.
            </h1>

            <p className="home-subtitle">
              Buy, sell, lend, and trade with nearby readers. Build a rotating
              shelf, save money, and keep stories in circulation.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="home-button home-button-primary">
                Start swapping free
                <ArrowRight className="home-button-icon" />
              </Link>

              <Link to="/login" className="home-button home-button-ghost">
                I already have an account
              </Link>
            </div>

            <div className="hero-metrics">
              <div className="metric-pill">
                <Users className="metric-icon" />
                <div>
                  <p className="metric-value">50k+</p>
                  <p className="metric-label">Active readers</p>
                </div>
              </div>

              <div className="metric-pill">
                <Leaf className="metric-icon" />
                <div>
                  <p className="metric-value">220k+</p>
                  <p className="metric-label">Books recirculated</p>
                </div>
              </div>

              <div className="metric-pill">
                <MapPin className="metric-icon" />
                <div>
                  <p className="metric-value">130+</p>
                  <p className="metric-label">Cities connected</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="search-card reveal-up">
            <h2>Find your next read</h2>
            <p>Search by title, author, or ISBN and discover local listings.</p>

            <label htmlFor="book-search" className="search-label">
              Book search
            </label>
            <div className="search-field">
              <Search className="search-icon" />
              <input
                id="book-search"
                type="text"
                placeholder="Atomic Habits, Orwell, 978..."
              />
            </div>
            <button type="button" className="search-action">
              Search books
            </button>

            <div className="book-preview-grid">
              <article className="book-chip">
                <h3>The Alchemist</h3>
                <p>From 3 nearby sellers</p>
              </article>
              <article className="book-chip">
                <h3>Educated</h3>
                <p>Available to trade</p>
              </article>
              <article className="book-chip">
                <h3>1984</h3>
                <p>2 lending offers live</p>
              </article>
            </div>
          </aside>
        </section>

        <section className="feature-panel">
          <header className="section-heading">
            <p className="section-eyebrow">Why readers choose BookSwap</p>
            <h2>Everything you need to keep books moving.</h2>
          </header>

          <div className="feature-grid">
            {features.map(({ title, description, Icon, tone }) => (
              <article
                key={title}
                className={`feature-card feature-card-${tone}`}
              >
                <div className="feature-icon-wrap">
                  <Icon className="feature-icon" />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="journey-panel">
          <header className="section-heading">
            <p className="section-eyebrow">How it works</p>
            <h2>Swap in three simple steps.</h2>
          </header>

          <div className="journey-grid">
            {journey.map(({ title, description, Icon }, index) => (
              <article key={title} className="journey-step">
                <span className="journey-number">0{index + 1}</span>
                <div className="journey-icon-wrap">
                  <Icon className="journey-icon" />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-panel">
          <h2>Build your local reading circle today.</h2>
          <p>
            Join readers who buy smarter, trade easier, and turn one finished
            book into someone else&apos;s favorite.
          </p>
          <Link to="/register" className="home-button home-button-light">
            Create my free account
          </Link>
        </section>
      </main>

      <footer className="home-footer">
        <div>
          <p className="footer-brand">BookSwap</p>
          <p className="footer-copy">
            Connecting readers through shared stories.
          </p>
        </div>

        <div className="footer-socials">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            aria-label="BookSwap on Twitter"
          >
            <Twitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="BookSwap on Instagram"
          >
            <Instagram />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="BookSwap on Facebook"
          >
            <Facebook />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
