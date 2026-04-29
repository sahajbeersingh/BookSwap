import { PageHeader, PageShell, SectionCard, StatusState } from "../components/PageLayout";

function Reviews() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Community"
        title="Reviews"
        description="Read and write reviews to build trust and credibility in the marketplace."
      />

      <SectionCard
        id="reviews-state"
        title="Ratings and feedback"
        description="Task 8 will implement score summaries, review feed, and add-review form."
      >
        <StatusState
          tone="neutral"
          title="Reviews page scaffolded"
          message="Task 8 will provide reusable review cards and rating input with validation states."
        />
      </SectionCard>
    </PageShell>
  );
}

export default Reviews;
