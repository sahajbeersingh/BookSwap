import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, PageShell, SectionCard, StatusState } from "../components/PageLayout";
import { collectionApi, extractApiError } from "../lib/api";
import "./WishlistCollection.css";

const STATUS_OPTIONS = ["owned", "reading", "lent", "completed"];

function Collection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState("");

  const loadCollection = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await collectionApi.getAll();
      setItems(Array.isArray(response?.data) ? response.data : []);
    } catch (apiError) {
      setError(extractApiError(apiError, "Unable to load collection."));
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollection();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      setBusyId(id);
      setActionError("");
      const response = await collectionApi.update(id, { status });
      const updated = response?.data;

      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (apiError) {
      setActionError(extractApiError(apiError, "Unable to update collection item status."));
    } finally {
      setBusyId("");
    }
  };

  const handleRemove = async (id) => {
    try {
      setBusyId(id);
      setActionError("");
      await collectionApi.remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (apiError) {
      setActionError(extractApiError(apiError, "Unable to remove collection item."));
    } finally {
      setBusyId("");
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Library"
        title="My collection"
        description="Books currently in your ownership, synced with /api/collection."
        actions={
          <Link className="btn btn-primary" to="/books">
            Add from books
          </Link>
        }
      />

      <SectionCard
        id="collection-overview"
        title="Owned books"
        description={`${items.length} item${items.length === 1 ? "" : "s"} in your collection`}
        action={
          <button className="btn btn-ghost" type="button" onClick={loadCollection} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        }
      >
        {loading ? (
          <StatusState
            tone="info"
            title="Loading collection"
            message="Fetching your book collection from the backend..."
          />
        ) : null}

        {!loading && error ? (
          <StatusState tone="error" title="Could not load collection" message={error} />
        ) : null}

        {!loading && !error && items.length === 0 ? (
          <StatusState
            tone="neutral"
            title="No books in your collection"
            message="Add books to your collection to track reading status and notes."
            actionLabel="Browse marketplace"
            actionTo="/books"
          />
        ) : null}

        {!loading && !error && items.length > 0 ? (
          <>
            {actionError ? (
              <StatusState tone="error" title="Action failed" message={actionError} />
            ) : null}

            <div className="entity-grid" role="list" aria-label="Collection items">
              {items.map((entry) => (
                <article className="entity-card" key={entry.id} role="listitem">
                  <p className="entity-eyebrow">{entry.books?.genre || "General"}</p>
                  <h3>{entry.books?.title || "Untitled Book"}</h3>
                  <p className="entity-subtitle">by {entry.books?.author || "Unknown author"}</p>
                  <p className="entity-note">Condition: {entry.condition || "Not specified"}</p>
                  <p className="entity-note">Notes: {entry.notes || "No notes"}</p>
                  <p className="entity-note">Status: {entry.status || "owned"}</p>

                  <label className="status-field" htmlFor={`status-${entry.id}`}>
                    Status
                    <select
                      id={`status-${entry.id}`}
                      value={entry.status || "owned"}
                      onChange={(event) => handleStatusChange(entry.id, event.target.value)}
                      disabled={busyId === entry.id}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="entity-actions">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => handleRemove(entry.id)}
                      disabled={busyId === entry.id}
                    >
                      {busyId === entry.id ? "Removing..." : "Remove"}
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

export default Collection;
