import {
  AudienceCondition,
  AudienceRequest,
  EventType,
  Operator,
} from "../types/audience";

const validEventTypes: EventType[] = [
  "page_view",
  "product_view",
  "add_to_cart",
  "checkout_started",
  "purchase",
];

const validOperators: Operator[] = [
  "at_least",
  "exactly",
];

export function validateAudienceRequest(
  body: unknown
): { valid: true; data: AudienceRequest } | {
  valid: false;
  message: string;
} {
  if (!body || typeof body !== "object") {
    return {
      valid: false,
      message: "Request body must be an object",
    };
  }

  const request = body as Record<string, unknown>;

  if (typeof request.name !== "string" || request.name.trim() === "") {
    return {
      valid: false,
      message: "name must be a non-empty string",
    };
  }

  if (typeof request.asOf !== "string") {
    return {
      valid: false,
      message: "asOf must be a string",
    };
  }

  const asOf = new Date(request.asOf);

  if (Number.isNaN(asOf.getTime())) {
    return {
      valid: false,
      message: "asOf must be a valid ISO date",
    };
  }

  if (!Array.isArray(request.conditions) || request.conditions.length === 0) {
    return {
      valid: false,
      message: "conditions must contain at least one condition",
    };
  }

  for (const condition of request.conditions) {
    const validation = validateCondition(condition);

    if (!validation.valid) {
      return validation;
    }
  }

  return {
    valid: true,
    data: request as unknown as AudienceRequest,
  };
}

function validateCondition(
  condition: unknown
): { valid: true } | { valid: false; message: string } {
  if (!condition || typeof condition !== "object") {
    return {
      valid: false,
      message: "Each condition must be an object",
    };
  }

  const value = condition as Partial<AudienceCondition>;

  if (!validEventTypes.includes(value.eventType as EventType)) {
    return {
      valid: false,
      message: "Invalid eventType",
    };
  }

  if (!validOperators.includes(value.operator as Operator)) {
    return {
      valid: false,
      message: "Invalid operator",
    };
  }

  if (
    typeof value.count !== "number" ||
    !Number.isInteger(value.count) ||
    value.count < 0
  ) {
    return {
      valid: false,
      message: "count must be a non-negative integer",
    };
  }

  if (
    typeof value.withinDays !== "number" ||
    !Number.isInteger(value.withinDays) ||
    value.withinDays <= 0
  ) {
    return {
      valid: false,
      message: "withinDays must be a positive integer",
    };
  }

  return { valid: true };
}