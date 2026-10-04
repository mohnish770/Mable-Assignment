export type EventType =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "checkout_started"
  | "purchase";

export type Operator =
  | "at_least"
  | "exactly";

export type Condition = {
  eventType: EventType;
  operator: Operator;
  count: number;
  withinDays: number;
};

export type AudienceRequest = {
  name: string;
  asOf: string;
  conditions: Condition[];
};

export type Evidence = {
  eventType: EventType;
  observedCount: number;
};

export type AudienceMember = {
  anonymousId: string;
  evidence: Evidence[];
};

export type PreviewResponse = {
  name: string;
  asOf: string;
  total: number;
  members: AudienceMember[];
};

export async function previewAudience(
  request: AudienceRequest
): Promise<PreviewResponse> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/audiences/preview`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    let message =
      "Failed to preview audience.";

    try {
      const errorData = await response.json();

      if (errorData.message) {
        message = errorData.message;
      }
    } catch {
      // Keep default error message
    }

    throw new Error(message);
  }

  return response.json();
}