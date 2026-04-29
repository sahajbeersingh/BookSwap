import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, PageShell, SectionCard, StatusState } from "../components/PageLayout";
import { bookApi, collectionApi, extractApiError, listingApi, wishlistApi } from "../lib/api";
import "./BookListings.css";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-low", label: "Price: Low to high" },
  { value: "price-high", label: "Price: High to low" },
  { value: "title", label: "Title: A to Z" },
];

const CONDITION_OPTIONS = [
  { value: "all", label: "All conditions" },
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "very_good", label: "Very Good" },
  { value: "good", label: "Good" },
  { value: "acceptable", label: "Acceptable" },
];

const CONDITION_LABELS = {
  new: "New",
  like_new: "Like New",
  very_good: "Very Good",
  good: "Good",
  acceptable: "Acceptable",
};

const COMMUNITY_LIST = [
  { name: "Campus Reads", members: "12.4k members" },
  { name: "Sci-Fi Swap", members: "8.1k members" },
  { name: "Romance Shelf", members: "5.6k members" },
  { name: "Used Textbooks", members: "4.2k members" },
  { name: "Comics Corner", members: "3.8k members" },
];

const normalizeListing = (item) => ({
  id: item.id,
  bookId: item.books?.id || "",
  title: item.books?.title || "Untitled Book",
  author: item.books?.author || "Unknown author",
  genre: item.books?.genre || "General",
  condition: item.condition || "",
  conditionLabel: CONDITION_LABELS[item.condition] || "Condition N/A",
  description: item.description || item.books?.description || "No description provided.",
  price: typeof item.price === "number" ? item.price : Number(item.price),
  createdAt: item.created_at || "",
  image: item.books?.cover_image || "",
  images: Array.isArray(item.books?.images) ? item.books.images : [],
});

function BookListings() {
  const [query, setQuery] = useState("");
  const [condition, setCondition] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [listings, setListings] = useState([]);
  const [bookMatches, setBookMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [actionNotice, setActionNotice] = useState({ type: "", message: "" });
  const [actionLoading, setActionLoading] = useState({ type: "", bookId: null });

  const loadListings = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await listingApi.getAll({ limit: 60, page: 1 });
      const normalized = Array.isArray(data?.data)
        ? data.data.map(normalizeListing)
        : [];

      setListings(normalized);
      setLastUpdated(new Date());
    } catch (apiError) {
      setError(extractApiError(apiError, "Unable to load listings right now."));
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  useEffect(() => {
    if (!actionNotice.message) {
      return;
    }

    const timer = setTimeout(() => {
      setActionNotice({ type: "", message: "" });
    }, 3000);

    return () => clearTimeout(timer);
  }, [actionNotice]);

  useEffect(() => {
    let cancelled = false;

    const searchBooks = async () => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setBookMatches([]);
        return;
      }

      try {
        setSearching(true);
        const [titleResults, authorResults] = await Promise.all([
          bookApi.searchByTitle(trimmedQuery),
          bookApi.searchByAuthor(trimmedQuery),
        ]);

        if (cancelled) {
          return;
        }

        const merged = [...(titleResults || []), ...(authorResults || [])];
        const deduped = merged.filter(
          (book, index, allBooks) => allBooks.findIndex((entry) => entry.id === book.id) === index,
        );
        setBookMatches(deduped);
      } catch {
        if (!cancelled) {
          setBookMatches([]);
        }
      } finally {
        if (!cancelled) {
          setSearching(false);
        }
      }
    };

    const timer = setTimeout(searchBooks, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const filteredListings = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    let next = [...listings];

    if (trimmedQuery) {
      const allowedBookIds = new Set(bookMatches.map((book) => String(book.id)));

      next = next.filter((item) => {
        const localMatch =
          item.title.toLowerCase().includes(trimmedQuery) ||
          item.author.toLowerCase().includes(trimmedQuery) ||
          item.genre.toLowerCase().includes(trimmedQuery);
        const remoteMatch = allowedBookIds.has(String(item.bookId));
        return localMatch || remoteMatch;
      });
    }

    if (condition !== "all") {
      next = next.filter((item) => item.condition === condition);
    }

    if (sortBy === "price-low") {
      next.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      next.sort((a, b) => b.price - a.price);
    } else if (sortBy === "title") {
      next.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      next.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return next;
  }, [bookMatches, condition, listings, query, sortBy]);

  const updatedLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "not yet";

  const handleWishlist = async (bookId) => {
    if (!bookId) {
      setActionNotice({ type: "error", message: "Missing book for wishlist action." });
      return;
    }

    try {
      setActionLoading({ type: "wishlist", bookId });
      setActionNotice({ type: "", message: "" });
      await wishlistApi.add({ book_id: bookId });
      setActionNotice({ type: "success", message: "Added to wishlist." });
    } catch (apiError) {
      setActionNotice({
        type: "error",
        message: extractApiError(apiError, "Unable to add to wishlist."),
      });
    } finally {
      setActionLoading({ type: "", bookId: null });
    }
  };

  const handleCollection = async (bookId) => {
    if (!bookId) {
      setActionNotice({ type: "error", message: "Missing book for collection action." });
      return;
    }

    try {
      setActionLoading({ type: "collection", bookId });
      setActionNotice({ type: "", message: "" });
      await collectionApi.add({ book_id: bookId });
      setActionNotice({ type: "success", message: "Added to collection." });
    } catch (apiError) {
      setActionNotice({
        type: "error",
        message: extractApiError(apiError, "Unable to add to collection."),
      });
    } finally {
      setActionLoading({ type: "", bookId: null });
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Discover"
        title="Book listings"
        description="Browse books listed by the community. Search by title, author, or genre and filter by condition."
        actions={
          <Link className="btn btn-primary" to="/sell">
            Add listing
          </Link>
        }
      />

      <div className="listings-layout">
        <aside className="community-rail" aria-label="Communities">
          <SectionCard
            id="communities"
            title="Your communities"
            description="Follow the circles you visit most often."
          >
            <div className="community-list">
              {COMMUNITY_LIST.map((community) => (
                <button className="community-chip" type="button" key={community.name}>
                  <span className="community-name">{community.name}</span>
                  <span className="community-meta">{community.members}</span>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            id="listings-filters"
            title="Filter feed"
            description="Search, condition, and sorting controls."
          >
            <form className="listings-toolbar" onSubmit={(event) => event.preventDefault()}>
              <label className="toolbar-field" htmlFor="listing-query">
                <span>Search</span>
                <input
                  id="listing-query"
                  name="listing-query"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by title, author, or genre"
                />
              </label>

              <label className="toolbar-field" htmlFor="listing-condition">
                <span>Condition</span>
                <select
                  id="listing-condition"
                  name="listing-condition"
                  value={condition}
                  onChange={(event) => setCondition(event.target.value)}
                >
                  {CONDITION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="toolbar-field" htmlFor="listing-sort">
                <span>Sort by</span>
                <select
                  id="listing-sort"
                  name="listing-sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </form>
          </SectionCard>
        </aside>

        <section className="feed-column" aria-label="Book feed">
          <SectionCard
            id="listings-results"
            title="Marketplace"
            description={`${filteredListings.length} result${filteredListings.length === 1 ? "" : "s"} • Updated ${updatedLabel}`}
            action={
              <button
                className="btn btn-ghost"
                type="button"
                onClick={loadListings}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            }
          >
            {loading ? (
              <StatusState
                tone="info"
                title="Loading listings"
                message="Pulling the latest books from the marketplace..."
              />
            ) : null}

            {!loading && actionNotice.message ? (
              <StatusState
                tone={actionNotice.type === "error" ? "error" : "info"}
                title={actionNotice.type === "error" ? "Action failed" : "Action complete"}
                message={actionNotice.message}
              />
            ) : null}

            {!loading && error ? (
              <StatusState
                tone="error"
                title="Could not load listings"
                message={`${error} Try refreshing to reload the marketplace.`}
              />
            ) : null}

            {!loading && !error && searching ? (
              <StatusState
                tone="info"
                title="Updating search results"
                message="Checking title and author matches..."
              />
            ) : null}

            {!loading && !error && filteredListings.length === 0 ? (
              <StatusState
                tone="neutral"
                title="No listings found"
                message="Try a different search query or switch to all conditions."
                actionLabel="Clear filters"
                actionTo="/books"
              />
            ) : null}

            {!loading && !error && filteredListings.length > 0 ? (
              <div className="listings-feed" role="list" aria-label="Book listings">
                {filteredListings.map((listing) => (
                  <article className="listing-card" key={listing.id} role="listitem">
                    <div className="listing-main">
                      <div className="listing-head">
                        <span className="listing-community">c/{listing.genre}</span>
                        <span className="listing-time">• Posted recently</span>
                      </div>
                      <h3>{listing.title}</h3>
                      <p className="listing-author">by {listing.author}</p>
                      <p className="listing-description">{listing.description}</p>

                      <div className="listing-media" aria-label="Listing images">
                        {Array.isArray(listing.images) && listing.images.length > 0 ? (
                          <div className="listing-carousel" role="list">
                            {listing.images.map((imageUrl, index) => (
                              <div className="listing-slide" role="listitem" key={imageUrl || index}>
                                <img src={imageUrl} alt="" loading="lazy" />
                              </div>
                            ))}
                          </div>
                        ) : listing.image ? (
                          <img src={listing.image} alt="" />
                        ) : (
                          <span>{listing.title.slice(0, 1).toUpperCase()}</span>
                        )}
                      </div>

                      <div className="listing-footer">
                        <span className="listing-condition">{listing.conditionLabel}</span>
                        <span className="listing-price">
                          {Number.isFinite(listing.price) ? `$${listing.price}` : "Price N/A"}
                        </span>
                        <Link className="btn btn-primary" to={`/books/${listing.id}`}>
                          View details
                        </Link>
                      </div>

                      <div className="listing-actions">
                        <button
                          className="btn btn-ghost"
                          type="button"
                          onClick={() => handleWishlist(listing.bookId)}
                          disabled={
                            actionLoading.type === "wishlist" &&
                            actionLoading.bookId === listing.bookId
                          }
                          aria-label="Save to wishlist"
                        >
                          <span className="action-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" role="img" focusable="false">
                              <path
                                d="M6 4.5c0-.83.67-1.5 1.5-1.5h9c.83 0 1.5.67 1.5 1.5v16.5l-6-3-6 3V4.5z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        </button>
                        <button
                          className="btn btn-ghost"
                          type="button"
                          onClick={() => handleCollection(listing.bookId)}
                          disabled={
                            actionLoading.type === "collection" &&
                            actionLoading.bookId === listing.bookId
                          }
                          aria-label="Add to collection"
                        >
                          <span className="action-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" role="img" focusable="false">
                              <path
                                d="M12 2l2.92 5.92 6.54.95-4.73 4.61 1.12 6.52L12 16.9l-5.85 3.07 1.12-6.52-4.73-4.61 6.54-.95L12 2z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        </button>
                      </div>

                      <form
                        className="listing-comment-form"
                        onSubmit={(event) => event.preventDefault()}
                      >
                        <label className="sr-only" htmlFor={`comment-${listing.id}`}>
                          Add a comment
                        </label>
                        <input
                          id={`comment-${listing.id}`}
                          type="text"
                          placeholder="Add a comment"
                        />
                        <button className="btn btn-primary" type="submit">
                          Post
                        </button>
                      </form>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </SectionCard>
        </section>
      </div>
    </PageShell>
  );
}

export default BookListings;
