import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listingApi, extractApiError } from "../lib/api";
import "./Home.css";

const featuredBooks = [
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    condition: "Like New",
    price: "$8",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    condition: "Good",
    price: "$11",
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    condition: "Very Good",
    price: "$10",
  },
];

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredError, setFeaturedError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadListings = async () => {
      try {
        setLoadingFeatured(true);
        setFeaturedError("");
        const data = await listingApi.getAll({ limit: 6, page: 1 });
        if (!isMounted) {
          return;
        }
        const normalized = Array.isArray(data?.data)
          ? data.data.map((item) => ({
              id: item.id,
              title: item.books?.title || "Untitled Book",
              author: item.books?.author || "Unknown author",
              condition: item.condition || "Condition N/A",
              price: item.price != null ? `$${item.price}` : "Price N/A",
            }))
          : [];

        setFeatured(normalized);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setFeaturedError(extractApiError(error, "Could not load featured listings."));
      } finally {
        if (isMounted) {
          setLoadingFeatured(false);
        }
      }
    };

    loadListings();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="home-page">
      <section className="hero" aria-labelledby="home-heading">
        <p className="hero-tag">Peer-to-peer reading marketplace</p>
        <h1 id="home-heading">Give your books a second shelf life</h1>
        <p className="hero-copy">
          BookSwap helps readers buy, sell, and trade books with a trusted
          community. Find affordable reads, list your own books, and connect
          with people who love stories as much as you do.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/signup">
            Join BookSwap
          </Link>
          <Link className="btn btn-ghost" to="/login">
            I already have an account
          </Link>
        </div>
      </section>

      <section className="home-section" aria-labelledby="featured-heading">
        <div className="section-head">
          <h2 id="featured-heading">Featured listings</h2>
          <span className="section-note">Popular this week</span>
        </div>

        {loadingFeatured ? (
          <div className="loading-state" role="status" aria-live="polite">
            Loading featured listings...
          </div>
        ) : null}

        {!loadingFeatured && featuredError ? (
          <div className="error-state" role="alert">
            <p>{featuredError}</p>
            <p>Showing sample listings while we reconnect.</p>
          </div>
        ) : null}

        {!loadingFeatured ? (
          <div className="book-grid" role="list" aria-label="Featured books">
            {(featuredError || featured.length === 0 ? featuredBooks : featured).map((book) => (
              <article className="book-card" key={book.id || book.title} role="listitem">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <div className="book-meta">
                  <span>{book.condition}</span>
                  <strong>{book.price}</strong>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="home-section" aria-labelledby="empty-heading">
        <div className="section-head">
          <h2 id="empty-heading">Your saved items</h2>
        </div>
        <div className="empty-state" role="status" aria-live="polite">
          <p>You have not saved any books yet.</p>
          <p>Sign in to save listings and track books you want to read next.</p>
          <Link className="btn btn-primary" to="/login">
            Sign in to start saving
          </Link>
        </div>
      </section>
    </section>
  );
}

export default Home;
