import { useEffect, useMemo, useState } from "react";
import { PageHeader, PageShell, SectionCard, StatusState } from "../components/PageLayout";
import { extractApiError, wishlistApi } from "../lib/api";
import "./WishlistCollection.css";

function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyBookId, setBusyBookId] = useState("");

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await wishlistApi.getAll();
      setItems(Array.isArray(response?.data) ? response.data : []);
    } catch (apiError) {
      setError(extractApiError(apiError, "Unable to load wishlist."));
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (bookId) => {
    try {
      setBusyBookId(bookId);
      setActionError("");
      await wishlistApi.remove(bookId);
      setItems((prev) => prev.filter((item) => item.book_id !== bookId));
    } catch (apiError) {
      setActionError(extractApiError(apiError, "Unable to remove book from wishlist."));
    } finally {
      setBusyBookId("");
    }
  };

  const stats = useMemo(() => {
    const total = items.length;
    const withGenre = items.filter((entry) => entry.books?.genre).length;
    return { total, withGenre };
  }, [items]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Saved"
        title="Wishlist"
        description="Books you want to buy or trade, synced from your real profile data."
      />

      <SectionCard
        id="wishlist-overview"
        title="Saved books"
        description={`${stats.total} total • ${stats.withGenre} with genre tags`}
        action={
          <button className="btn btn-ghost" type="button" onClick={loadWishlist} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        }
      >
        {loading ? (
          <StatusState
            tone="info"
            title="Loading wishlist"
            message="Fetching your saved books from /api/wishlist..."
          />
        ) : null}

        {!loading && error ? (
          <StatusState tone="error" title="Could not load wishlist" message={error} />
        ) : null}

        {!loading && !error && items.length === 0 ? (
          <StatusState
            tone="neutral"
            title="Your wishlist is empty"
            message="Save books from listing detail pages to track them here."
          />
        ) : null}

        {!loading && !error && items.length > 0 ? (
          <>
            {actionError ? (
              <StatusState tone="error" title="Action failed" message={actionError} />
            ) : null}
            <div className="entity-grid" role="list" aria-label="Wishlist items">
              {items.map((entry) => (
                <article className="entity-card" key={entry.id} role="listitem">
                  <p className="entity-eyebrow">{entry.books?.genre || "General"}</p>
                  <h3>{entry.books?.title || "Untitled Book"}</h3>
                  <p className="entity-subtitle">by {entry.books?.author || "Unknown author"}</p>
                  <p className="entity-note">ISBN: {entry.books?.isbn || "Not listed"}</p>
                  <div className="entity-actions">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => handleRemove(entry.book_id)}
                      disabled={busyBookId === entry.book_id}
                    >
                      {busyBookId === entry.book_id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

export default Wishlist;
