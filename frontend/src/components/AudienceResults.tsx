import type { PreviewResponse } from "../services/audienceApi";

type AudienceResultsProps = {
  result: PreviewResponse;
};

function formatEventType(
  eventType: string
) {
  return eventType
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function AudienceResults({
  result,
}: AudienceResultsProps) {
  return (
    <section className="card results-card">
      <div className="results-header">
        <div>
          <p className="eyebrow">
            PREVIEW RESULTS
          </p>

          <h2>{result.name}</h2>

          <p className="results-subtitle">
            Audience evaluated as of{" "}
            {new Date(
              result.asOf
            ).toLocaleString()}
          </p>
        </div>

        <div className="audience-size">
          <span className="size-number">
            {result.total}
          </span>

          <span className="size-label">
            matching{" "}
            {result.total === 1
              ? "user"
              : "users"}
          </span>
        </div>
      </div>

      {result.members.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            0
          </div>

          <h3>
            No users matched
          </h3>

          <p>
            Try adjusting your conditions or
            time window and preview again.
          </p>
        </div>
      ) : (
        <div className="members-list">
          {result.members.map(
            (member) => (
              <div
                className="member-row"
                key={member.anonymousId}
              >
                <div className="member-info">
                  <div className="avatar">
                    {member.anonymousId
                      .replace("anon_", "")
                      .slice(-2)}
                  </div>

                  <div>
                    <strong>
                      {member.anonymousId}
                    </strong>

                    <span>
                      Anonymous user
                    </span>
                  </div>
                </div>

                <div className="evidence-list">
                  {member.evidence.map(
                    (evidence) => (
                      <div
                        className="evidence-item"
                        key={
                          evidence.eventType
                        }
                      >
                        <span className="evidence-name">
                          {formatEventType(
                            evidence.eventType
                          )}
                        </span>

                        <span className="evidence-count">
                          {evidence.observedCount}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}

export default AudienceResults;