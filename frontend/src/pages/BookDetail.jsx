import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHeader, PageShell, SectionCard, StatusState } from "../components/PageLayout";
import {
  collectionApi,
  extractApiError,
  listingApi,
  tradeRequestApi,
  wishlistApi,
} from "../lib/api";
import useAuth from "../hooks/useAuth";
import "./BookDetail.css";

const formatPrice = (price) => {
  const normalized = typeof price === "number" ? price : Number(price);
  return Number.isFinite(normalized) ? `$${normalized}` : "Price N/A";
};

const formatRelativeDate = (value) => {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function BookDetail() {
  const { listingId } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [actionNotice, setActionNotice] = useState({ type: "", message: "" });
  const [actionLoading, setActionLoading] = useState("");
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [tradeMessage, setTradeMessage] = useState("");
  const [tradeContact, setTradeContact] = useState("email");
  const [tradeSubmitting, setTradeSubmitting] = useState(false);
  const [tradeError, setTradeError] = useState("");
  const [tradeSuccess, setTradeSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadListing = async () => {
      if (!listingId) {
        setLoading(false);
        setError("Missing listing ID.");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await listingApi.getById(listingId);

        if (!cancelled) {
          setListing(data || null);
        }
      } catch (apiError) {
        if (!cancelled) {
          setListing(null);
          setError(extractApiError(apiError, "Unable to load listing details."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadListing();

    return () => {
      cancelled = true;
    };
  }, [listingId]);

  useEffect(() => {
    if (!actionNotice.message) {
      return;
    }

    const timer = setTimeout(() => {
      setActionNotice({ type: "", message: "" });
    }, 3000);

    return () => clearTimeout(timer);
  }, [actionNotice]);

  const book = useMemo(() => listing?.books || {}, [listing]);
  const bookImages = useMemo(
    () => (Array.isArray(book.images) && book.images.length ? book.images : []),
    [book.images],
  );
  const hasBookData = Boolean(book?.title || book?.author || book?.isbn);

  const handleTradeSubmit = async (event) => {
    event.preventDefault();
    if (!listing?.id) {
      setTradeError("Missing listing information.");
      return;
    }

    try {
      setTradeSubmitting(true);
      setTradeError("");
      setTradeSuccess("");
      await tradeRequestApi.create({
        listing_id: listing.id,
        message: tradeMessage.trim() || null,
        contact_preference: tradeContact,
      });
      setTradeSuccess("Trade request sent.");
      setTradeMessage("");
      setTimeout(() => {
        setIsTradeOpen(false);
        setTradeSuccess("");
      }, 900);
    } catch (apiError) {
      setTradeError(extractApiError(apiError, "Unable to submit trade request."));
    } finally {
      setTradeSubmitting(false);
    }
  };

  const handleWishlist = async () => {
    const bookId = book?.id;
    if (!bookId) {
      setActionNotice({ type: "error", message: "Missing book for wishlist action." });
      return;
    }

    try {
      setActionLoading("wishlist");
      setActionNotice({ type: "", message: "" });
      await wishlistApi.add({ book_id: bookId });
      setActionNotice({ type: "success", message: "Added to wishlist." });
    } catch (apiError) {
      setActionNotice({
        type: "error",
        message: extractApiError(apiError, "Unable to add to wishlist."),
      });
    } finally {
      setActionLoading("");
    }
  };

  const handleCollection = async () => {
    const bookId = book?.id;
    if (!bookId) {
      setActionNotice({ type: "error", message: "Missing book for collection action." });
      return;
    }

    try {
      setActionLoading("collection");
      setActionNotice({ type: "", message: "" });
      await collectionApi.add({ book_id: bookId });
      setActionNotice({ type: "success", message: "Added to collection." });
    } catch (apiError) {
      setActionNotice({
        type: "error",
        message: extractApiError(apiError, "Unable to add to collection."),
      });
    } finally {
      setActionLoading("");
    }
  };

  const metaRows = useMemo(
    () => [
      { label: "Author", value: book.author || "Unknown author" },
      { label: "ISBN", value: book.isbn || "Not listed" },
      { label: "Publisher", value: book.publisher || "Not listed" },
      {
        label: "Publication year",
        value: book.publication_year ? String(book.publication_year) : "Not listed",
      },
      { label: "Genre", value: book.genre || "General" },
      { label: "Condition", value: listing?.condition || "Not listed" },
      { label: "Status", value: listing?.status || "Unavailable" },
      { label: "Listed on", value: formatRelativeDate(listing?.created_at) },
    ],
    [book, listing],
  );

  return (
    <PageShell>
      <PageHeader
        eyebrow="Listing"
        title={hasBookData ? book.title : "Book detail"}
        description={
          hasBookData
            ? `Explore listing details for ${book.title} and review trade options.`
            : `Viewing listing: ${listingId || "unknown"}`
        }
        actions={
          <Link className="btn btn-ghost" to="/books">
            Back to listings
          </Link>
        }
      />

      {loading ? (
        <StatusState
          tone="info"
          title="Loading listing"
          message="Fetching complete book and listing details..."
        />
      ) : null}

      {!loading && error ? (
        <StatusState
          tone="error"
          title="Could not load listing"
          message={`${error} Please check the listing link or try again.`}
          actionLabel="Return to listings"
          actionTo="/books"
        />
      ) : null}

      {!loading && !error && !listing ? (
        <StatusState
          tone="neutral"
          title="Listing not found"
          message="The listing may have been removed or is no longer available."
          actionLabel="Browse other books"
          actionTo="/books"
        />
      ) : null}

      {!loading && !error && listing ? (
        <div className="detail-grid">
          <SectionCard
            id="book-overview"
            title="Book overview"
            description="Main listing details and description"
          >
            <article className="detail-overview">
              <div className="detail-cover" aria-label="Listing images">
                {bookImages.length > 0 ? (
                  <div className="detail-carousel" role="list">
                    {bookImages.map((imageUrl, index) => (
                      <div className="detail-slide" role="listitem" key={imageUrl || index}>
                        <img src={imageUrl} alt="" loading="lazy" />
                      </div>
                    ))}
                  </div>
                ) : book.cover_image ? (
                  <img src={book.cover_image} alt="" />
                ) : (
                  <span>{(book.title || "B").slice(0, 1).toUpperCase()}</span>
                )}
              </div>

              <div className="detail-summary">
                <p className="detail-price">{formatPrice(listing.price)}</p>
                <h2>{book.title || "Untitled Book"}</h2>
                <p className="detail-author">by {book.author || "Unknown author"}</p>
                <p className="detail-description">
                  {listing.description || book.description || "No description has been added yet."}
                </p>

                {actionNotice.message ? (
                  <StatusState
                    tone={actionNotice.type === "error" ? "error" : "info"}
                    title={actionNotice.type === "error" ? "Action failed" : "Action complete"}
                    message={actionNotice.message}
                  />
                ) : null}

                <div className="detail-actions" aria-label="Listing actions">
                  {listing?.seller_id === user?.id ? (
                    <StatusState
                      tone="neutral"
                      title="Your listing"
                      message="You cannot request a trade on your own listing."
                    />
                  ) : (
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        setIsTradeOpen(true);
                        setTradeError("");
                        setTradeSuccess("");
                      }}
                    >
                      Request trade
                    </button>
                  )}
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={handleWishlist}
                    disabled={actionLoading === "wishlist"}
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
                    onClick={handleCollection}
                    disabled={actionLoading === "collection"}
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
              </div>
            </article>
          </SectionCard>

          <SectionCard
            id="book-metadata"
            title="Book metadata"
            description="Edition, condition, and listing identifiers"
          >
            <dl className="meta-list">
              {metaRows.map((row) => (
                <div className="meta-row" key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>

          <SectionCard
            id="seller-info"
            title="Seller"
            description="Current seller details exposed by this listing"
          >
            <div className="seller-panel">
              <p>
                <strong>Seller ID:</strong> {listing.seller_id || "Not provided"}
              </p>
              <p>
                <strong>Listing ID:</strong> {listing.id}
              </p>
              <p>
                Seller profile details will be expanded once dedicated profile endpoints are connected.
              </p>
              <Link className="btn btn-ghost" to="/messages">
                Message seller
              </Link>
            </div>
          </SectionCard>
        </div>
      ) : null}

      {isTradeOpen ? (
        <div className="trade-overlay" role="dialog" aria-modal="true">
          <div className="trade-modal">
            <div className="trade-modal-header">
              <h3>Request a trade</h3>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => setIsTradeOpen(false)}
                aria-label="Close trade request"
              >
                Close
              </button>
            </div>
            <p className="trade-modal-subtitle">
              Send a note to the seller and share your preferred contact method.
            </p>
            <form className="trade-form" onSubmit={handleTradeSubmit}>
              <label htmlFor="trade-message">
                Message
                <textarea
                  id="trade-message"
                  rows="4"
                  value={tradeMessage}
                  onChange={(event) => setTradeMessage(event.target.value)}
                  placeholder="Introduce yourself and propose a trade."
                />
              </label>

              <label htmlFor="trade-contact">
                Contact preference
                <select
                  id="trade-contact"
                  value={tradeContact}
                  onChange={(event) => setTradeContact(event.target.value)}
                >
                  <option value="email">Email</option>
                  <option value="chat">In-app chat</option>
                  <option value="phone">Phone</option>
                </select>
              </label>

              {tradeError ? (
                <StatusState tone="error" title="Trade request failed" message={tradeError} />
              ) : null}
              {tradeSuccess ? (
                <StatusState tone="info" title="Trade request sent" message={tradeSuccess} />
              ) : null}

              <div className="trade-modal-actions">
                <button className="btn btn-ghost" type="button" onClick={() => setIsTradeOpen(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit" disabled={tradeSubmitting}>
                  {tradeSubmitting ? "Sending..." : "Send request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}

export default BookDetail;
