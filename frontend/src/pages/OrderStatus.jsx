import { PageHeader, PageShell, SectionCard, StatusState } from "../components/PageLayout";

function OrderStatus() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Orders"
        title="Order status"
        description="Follow each order from request to completion with a timeline view."
      />

      <SectionCard
        id="order-status-state"
        title="Status timeline"
        description="Task 7 will implement stage-based tracking and history details."
      >
        <StatusState
          tone="neutral"
          title="Order status page scaffolded"
          message="Task 7 will add timeline components for pending, accepted, shipped, completed, and cancelled states."
        />
      </SectionCard>
    </PageShell>
  );
}

export default OrderStatus;
