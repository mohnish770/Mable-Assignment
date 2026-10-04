import { useState } from "react";
import "./App.css";

import ConditionRow from "./components/ConditionRow";
import AudienceResults from "./components/AudienceResults";

import {
  previewAudience as previewAudienceApi,
  type Condition,
  type EventType,
  type Operator,
  type PreviewResponse,
} from "./services/audienceApi";

function App() {
  const [name, setName] = useState("");

  const [asOf, setAsOf] = useState(
    "2026-09-29T00:00"
  );

  const [conditions, setConditions] = useState<
    Condition[]
  >([
    {
      eventType: "product_view",
      operator: "at_least",
      count: 2,
      withinDays: 7,
    },
  ]);

  const [result, setResult] =
    useState<PreviewResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  const validateForm = () => {
    if (!name.trim()) {
      return "Please enter an audience name.";
    }

    if (!asOf) {
      return "Please select an as-of date.";
    }

    if (conditions.length === 0) {
      return "Add at least one condition.";
    }

    for (const condition of conditions) {
      if (condition.count < 0) {
        return "Event count cannot be negative.";
      }

      if (condition.withinDays < 1) {
        return "Time window must be at least 1 day.";
      }
    }

    return "";
  };


  const addCondition = () => {
    setConditions((previousConditions) => [
      ...previousConditions,
      {
        eventType: "product_view",
        operator: "at_least",
        count: 1,
        withinDays: 7,
      },
    ]);
  };


  const removeCondition = (
    indexToRemove: number
  ) => {
    setConditions((previousConditions) =>
      previousConditions.filter(
        (_, index) =>
          index !== indexToRemove
      )
    );
  };


  const updateEventType = (
    index: number,
    eventType: EventType
  ) => {
    setConditions((previousConditions) =>
      previousConditions.map(
        (condition, conditionIndex) =>
          conditionIndex === index
            ? { ...condition, eventType }
            : condition
      )
    );
  };

  const updateOperator = (
    index: number,
    operator: Operator
  ) => {
    setConditions((previousConditions) =>
      previousConditions.map(
        (condition, conditionIndex) =>
          conditionIndex === index
            ? { ...condition, operator }
            : condition
      )
    );
  };

  const updateCount = (
    index: number,
    count: number
  ) => {
    setConditions((previousConditions) =>
      previousConditions.map(
        (condition, conditionIndex) =>
          conditionIndex === index
            ? { ...condition, count }
            : condition
      )
    );
  };

  const updateWithinDays = (
    index: number,
    withinDays: number
  ) => {
    setConditions((previousConditions) =>
      previousConditions.map(
        (condition, conditionIndex) =>
          conditionIndex === index
            ? { ...condition, withinDays }
            : condition
      )
    );
  };


  const handlePreview = async () => {
    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const data =
        await previewAudienceApi({
          name: name.trim(),
          asOf: new Date(
            asOf
          ).toISOString(),
          conditions,
        });

      setResult(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading the audience."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            M
          </div>

          <div>
            <div className="brand-name">
              Mable
            </div>

            <div className="brand-subtitle">
              Audience Builder
            </div>
          </div>
        </div>

      </header>

      <main className="main-content">

        <section className="page-heading">
          <div>
            <p className="eyebrow">
              AUDIENCE BUILDER
            </p>

            <h1>
              Build your audience
            </h1>

          </div>
        </section>


        <section className="card">
          <div className="card-header">
            <div>
              <h2>Audience details</h2>

              <p>
                Give your audience a name and choose
                when the rules should be evaluated.
              </p>
            </div>
          </div>

          <div className="details-grid">
            <div className="field">
              <label htmlFor="audience-name">
                Audience name
              </label>

              <input
                id="audience-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="e.g. Viewed but not purchased"
              />
            </div>

            <div className="field">
              <label htmlFor="as-of">
                Evaluate as of
              </label>

              <input
                id="as-of"
                type="datetime-local"
                value={asOf}
                onChange={(event) =>
                  setAsOf(event.target.value)
                }
              />
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header conditions-header">
            <div>
              <h2>Audience conditions</h2>

              <p>
                Users must satisfy every condition
                below.
              </p>
            </div>

            <span className="condition-count">
              {conditions.length}{" "}
              {conditions.length === 1
                ? "condition"
                : "conditions"}
            </span>
          </div>

          <div className="conditions-list">
            {conditions.map(
              (condition, index) => (
                <ConditionRow
                  key={index}
                  condition={condition}
                  index={index}
                  canRemove={
                    conditions.length > 1
                  }
                  onEventTypeChange={
                    updateEventType
                  }
                  onOperatorChange={
                    updateOperator
                  }
                  onCountChange={
                    updateCount
                  }
                  onWithinDaysChange={
                    updateWithinDays
                  }
                  onRemove={
                    removeCondition
                  }
                />
              )
            )}
          </div>

          <button
            type="button"
            className="add-condition-button"
            onClick={addCondition}
          >
            <span>+</span>
            Add condition
          </button>
        </section>


        <div className="preview-area">
          <button
            type="button"
            className="preview-button"
            onClick={handlePreview}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Evaluating audience...
              </>
            ) : (
              <>
                Preview audience
                <span className="arrow">
                  →
                </span>
              </>
            )}
          </button>

        </div>


        {error && (
          <div
            className="error-card"
            role="alert"
          >
            <div className="error-icon">
              !
            </div>

            <div className="error-content">
              <strong>
                Unable to preview audience
              </strong>

              <p>{error}</p>

              <button
                type="button"
                onClick={handlePreview}
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {result && (
          <AudienceResults result={result} />
        )}
      </main>
    </div>
  );
}

export default App;