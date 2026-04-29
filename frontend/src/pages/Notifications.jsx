import { PageHeader, PageShell, SectionCard, StatusState } from "../components/PageLayout";

function Notifications() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Updates"
        title="Notifications"
        description="Keep up with listing changes, trade updates, and new messages."
      />

      <SectionCard
        id="notifications-state"
        title="Notification center"
        description="Task 8 will add grouped notifications with read/unread controls."
      >
        <StatusState
          tone="info"
          title="Notifications page scaffolded"
          message="Task 8 will add grouped notification feeds, filters, and mark-as-read behavior."
        />
      </SectionCard>
    </PageShell>
  );
}

export default Notifications;
