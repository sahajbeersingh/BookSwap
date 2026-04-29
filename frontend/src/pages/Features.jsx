import { Link } from "react-router-dom";
import "./Features.css";

const highlights = [
  {
    title: "Community-first feeds",
    description: "Follow reader communities and see the most active listings first.",
  },
  {
    title: "Trusted swaps",
    description: "Ratings, wishlists, and verified profiles keep every trade safe.",
  },
  {
    title: "Smart discovery",
    description: "Filter by genre, condition, and price to find the perfect copy.",
  },
  {
    title: "List in minutes",
    description: "Snap a photo, describe condition, and publish instantly.",
  },
];

const steps = [
  {
    title: "Join a community",
    description: "Browse genres, campuses, or neighborhoods and subscribe to what matters.",
  },
  {
    title: "Post your book",
    description: "Share condition, price, and pickup preferences with clear details.",
  },
  {
    title: "Swap or sell",
    description: "Chat, coordinate pickup, and trade books that deserve a new shelf.",
  },
];

function Features() {
  return (
    <section className="features-page" aria-labelledby="features-heading">
      <header className="features-hero">
        <p className="features-tag">How BookSwap works</p>
        <h1 id="features-heading">Everything you need to swap smarter</h1>
        <p>
          Discover a marketplace built around trusted communities. Organize your shelves, meet new
          readers, and keep stories moving.
        </p>
        <div className="features-actions">
          <Link className="btn btn-primary" to="/signup">
            Start your community
          </Link>
          <Link className="btn btn-ghost" to="/books">
            Browse listings
          </Link>
        </div>
      </header>

      <section className="features-grid" aria-label="Feature highlights">
        {highlights.map((item) => (
          <article className="feature-card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="features-steps" aria-label="Swap flow">
        <h2>Three steps to a new shelf</h2>
        <ol>
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="step-index">0{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}

export default Features;
