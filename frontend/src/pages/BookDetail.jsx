import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHeader, PageShell, SectionCard, StatusState } from "../components/PageLayout";
import { extractApiError, listingApi } from "../lib/api";
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

  const book = useMemo(() => listing?.books || {}, [listing]);
  const bookImages = useMemo(
    () => (Array.isArray(book.images) && book.images.length ? book.images : []),
    [book.images],
  );
  const hasBookData = Boolean(book?.title || book?.author || book?.isbn);

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

                <div className="detail-actions" aria-label="Listing actions">
                  <button className="btn btn-primary" type="button">
                    Request trade
                  </button>
                  <button className="btn btn-ghost" type="button">
                    Add to wishlist
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
    </PageShell>
  );
}

export default BookDetail;
