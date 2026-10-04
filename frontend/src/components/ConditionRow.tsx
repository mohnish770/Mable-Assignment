import type {
  Condition,
  EventType,
  Operator,
} from "../services/audienceApi";

type ConditionRowProps = {
  condition: Condition;
  index: number;
  canRemove: boolean;

  onEventTypeChange: (
    index: number,
    eventType: EventType
  ) => void;

  onOperatorChange: (
    index: number,
    operator: Operator
  ) => void;

  onCountChange: (
    index: number,
    count: number
  ) => void;

  onWithinDaysChange: (
    index: number,
    withinDays: number
  ) => void;

  onRemove: (index: number) => void;
};

function ConditionRow({
  condition,
  index,
  canRemove,
  onEventTypeChange,
  onOperatorChange,
  onCountChange,
  onWithinDaysChange,
  onRemove,
}: ConditionRowProps) {
  return (
    <div className="condition-row">
      <div className="condition-number">
        {index + 1}
      </div>

      <div className="condition-fields">

        <div className="field condition-field">
          <label htmlFor={`event-${index}`}>
            Event
          </label>

          <select
            id={`event-${index}`}
            value={condition.eventType}
            onChange={(event) =>
              onEventTypeChange(
                index,
                event.target.value as EventType
              )
            }
          >
            <option value="page_view">
              Page view
            </option>

            <option value="product_view">
              Product view
            </option>

            <option value="add_to_cart">
              Add to cart
            </option>

            <option value="checkout_started">
              Checkout started
            </option>

            <option value="purchase">
              Purchase
            </option>
          </select>
        </div>

        <div className="field condition-field">
          <label htmlFor={`operator-${index}`}>
            Operator
          </label>

          <select
            id={`operator-${index}`}
            value={condition.operator}
            onChange={(event) =>
              onOperatorChange(
                index,
                event.target.value as Operator
              )
            }
          >
            <option value="at_least">
              At least
            </option>

            <option value="exactly">
              Exactly
            </option>
          </select>
        </div>

        <div className="field small-field">
          <label htmlFor={`count-${index}`}>
            Count
          </label>

          <input
            id={`count-${index}`}
            type="number"
            min="0"
            value={condition.count}
            onChange={(event) =>
              onCountChange(
                index,
                Number(event.target.value)
              )
            }
          />
        </div>


        <div className="field time-field">
          <label htmlFor={`within-${index}`}>
            Time window
          </label>

          <div className="input-with-suffix">
            <input
              id={`within-${index}`}
              type="number"
              min="1"
              value={condition.withinDays}
              onChange={(event) =>
                onWithinDaysChange(
                  index,
                  Number(event.target.value)
                )
              }
            />

            <span>days</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="remove-button"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        aria-label={`Remove condition ${
          index + 1
        }`}
      >
        ×
      </button>
    </div>
  );
}

export default ConditionRow;