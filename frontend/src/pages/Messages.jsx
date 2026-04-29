import { PageHeader, PageShell, SectionCard, StatusState } from "../components/PageLayout";
import "./Messages.css";

function Messages() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Chat with buyers and sellers to coordinate trades and exchanges."
      />

      <SectionCard
        id="messages-state"
        title="Conversations"
        description="All your buyer and seller conversations in one place."
      >
        <StatusState
          tone="neutral"
          title="No conversations yet"
          message="When you message a buyer or seller, it will appear here."
        />
      </SectionCard>
    </PageShell>
  );
}

export default Messages;
