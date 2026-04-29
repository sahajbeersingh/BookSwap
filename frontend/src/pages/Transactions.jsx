import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, PageShell, SectionCard, StatusState } from "../components/PageLayout";
import { extractApiError, tradeRequestApi } from "../lib/api";
import "./Transactions.css";

function Transactions() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const [incomingResponse, outgoingResponse] = await Promise.all([
        tradeRequestApi.getIncoming(),
        tradeRequestApi.getOutgoing(),
      ]);
      setIncoming(Array.isArray(incomingResponse?.data) ? incomingResponse.data : []);
      setOutgoing(Array.isArray(outgoingResponse?.data) ? outgoingResponse.data : []);
    } catch (apiError) {
      setError(extractApiError(apiError, "Unable to load trade requests."));
      setIncoming([]);
      setOutgoing([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const summary = useMemo(() => {
    return {
      incoming: incoming.length,
      outgoing: outgoing.length,
    };
  }, [incoming, outgoing]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Trades"
        title="Trade requests"
        description="Review incoming and outgoing trade requests in one place."
      />

      <SectionCard
        id="transactions-state"
        title="Request pipeline"
        description={`${summary.incoming} incoming • ${summary.outgoing} outgoing`}
        action={
          <button className="btn btn-ghost" type="button" onClick={loadRequests} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        }
      >
        <div className="request-pipeline">
          <div className="request-columns">
            <div>
              <h2>Incoming</h2>
              <p className="request-subtitle">Requests waiting on you</p>
              <div className="request-list">
                {loading ? (
                  <StatusState
                    tone="info"
                    title="Loading incoming requests"
                    message="Checking new trade requests..."
                  />
                ) : null}

                {!loading && error ? (
                  <StatusState tone="error" title="Could not load requests" message={error} />
                ) : null}

                {!loading && !error && incoming.length === 0 ? (
                  <StatusState
                    tone="neutral"
                    title="No incoming requests"
                    message="When a buyer requests a swap or purchase, it will appear here."
                  />
                ) : null}

                {!loading && !error && incoming.length > 0 ? (
                  <div className="request-cards" role="list">
                    {incoming.map((request) => (
                      <article className="request-card" role="listitem" key={request.id}>
                        <p className="request-eyebrow">Incoming</p>
                        <h3>{request.listings?.books?.title || "Untitled Book"}</h3>
                        <p className="request-subtitle">
                          {request.listings?.books?.author || "Unknown author"}
                        </p>
                        <p className="request-note">
                          {request.message || "No message provided."}
                        </p>
                        <p className="request-meta">
                          Contact: {request.contact_preference || "Not specified"}
                        </p>
                        <div className="request-actions">
                          <Link className="btn btn-ghost" to={`/messages?tradeRequestId=${request.id}`}>
                            Open thread
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <h2>Outgoing</h2>
              <p className="request-subtitle">Requests you sent</p>
              <div className="request-list">
                {loading ? (
                  <StatusState
                    tone="info"
                    title="Loading outgoing requests"
                    message="Fetching your sent requests..."
                  />
                ) : null}

                {!loading && error ? (
                  <StatusState tone="error" title="Could not load requests" message={error} />
                ) : null}

                {!loading && !error && outgoing.length === 0 ? (
                  <StatusState
                    tone="neutral"
                    title="No outgoing requests"
                    message="Your pending requests will show up here with status updates."
                  />
                ) : null}

                {!loading && !error && outgoing.length > 0 ? (
                  <div className="request-cards" role="list">
                    {outgoing.map((request) => (
                      <article className="request-card" role="listitem" key={request.id}>
                        <p className="request-eyebrow">Outgoing</p>
                        <h3>{request.listings?.books?.title || "Untitled Book"}</h3>
                        <p className="request-subtitle">
                          {request.listings?.books?.author || "Unknown author"}
                        </p>
                        <p className="request-note">
                          {request.message || "No message provided."}
                        </p>
                        <p className="request-meta">
                          Contact: {request.contact_preference || "Not specified"}
                        </p>
                        <div className="request-actions">
                          <Link className="btn btn-ghost" to={`/messages?tradeRequestId=${request.id}`}>
                            Open thread
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </PageShell>
  );
}

export default Transactions;
