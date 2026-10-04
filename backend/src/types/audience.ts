export type EventType =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "checkout_started"
  | "purchase";

export type Operator = "at_least" | "exactly";

export interface AudienceCondition {
  eventType: EventType;
  operator: Operator;
  count: number;
  withinDays: number;
}

export interface AudienceRequest {
  name: string;
  asOf: string;
  conditions: AudienceCondition[];
}

export interface Evidence {
  eventType: EventType;
  observedCount: number;
}

export interface AudienceMember {
  anonymousId: string;
  evidence: Evidence[];
}