import { PageHeader, PageShell, SectionCard, StatusState } from "../components/PageLayout";
import "./Transactions.css";

function Transactions() {
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
        description="Track every incoming and outgoing request with clear next steps."
      >
        <div className="request-pipeline">
          <div className="request-columns">
            <div>
              <h2>Incoming</h2>
              <p className="request-subtitle">Requests waiting on you</p>
              <div className="request-list">
                <StatusState
                  tone="neutral"
                  title="No incoming requests"
                  message="When a buyer requests a swap or purchase, it will appear here."
                />
              </div>
            </div>

            <div>
              <h2>Outgoing</h2>
              <p className="request-subtitle">Requests you sent</p>
              <div className="request-list">
                <StatusState
                  tone="neutral"
                  title="No outgoing requests"
                  message="Your pending requests will show up here with status updates."
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </PageShell>
  );
}

export default Transactions;
