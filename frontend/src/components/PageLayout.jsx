import { Link } from "react-router-dom";

export function PageShell({ children }) {
  return <section className="page-shell">{children}</section>;
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="page-header">
      <div>
        {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="page-description">{description}</p> : null}
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </header>
  );
}

export function SectionCard({ id, title, description, children, action }) {
  const headingId = id || "section-card-title";

  return (
    <section className="section-card" aria-labelledby={headingId}>
      <div className="section-card-head">
        <div>
          <h2 id={headingId}>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div>{children}</div>
    </section>
  );
}

export function StatusState({
  tone = "neutral",
  title,
  message,
  actionLabel,
  actionTo,
}) {
  return (
    <div className={`status-state status-${tone}`} role="status" aria-live="polite">
      <h3>{title}</h3>
      {message ? <p>{message}</p> : null}
      {actionLabel && actionTo ? (
        <Link className="btn btn-primary" to={actionTo}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
