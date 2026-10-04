import db from "../db/database";
import {
  AudienceCondition,
  AudienceMember,
  AudienceRequest,
} from "../types/audience";

interface EventRow {
  anonymous_id: string;
  event_type: string;
  occurred_at: string;
}

function getWindowStart(asOf: string, withinDays: number): string {
  const end = new Date(asOf);
  const start = new Date(end);

  start.setUTCDate(start.getUTCDate() - withinDays);

  return start.toISOString();
}

function getObservedCount(
  anonymousId: string,
  condition: AudienceCondition,
  asOf: string
): number {
  const windowStart = getWindowStart(asOf, condition.withinDays);

  const result = db
    .prepare(
      `
      SELECT COUNT(*) as count
      FROM events
      WHERE anonymous_id = ?
        AND event_type = ?
        AND occurred_at >= ?
        AND occurred_at <= ?
      `
    )
    .get(
      anonymousId,
      condition.eventType,
      windowStart,
      asOf
    ) as { count: number };

  return result.count;
}

function conditionMatches(
  observedCount: number,
  condition: AudienceCondition
): boolean {
  if (condition.operator === "at_least") {
    return observedCount >= condition.count;
  }

  if (condition.operator === "exactly") {
    return observedCount === condition.count;
  }

  return false;
}

export function evaluateAudience(
  request: AudienceRequest
): AudienceMember[] {
  const users = db
    .prepare(
      `
      SELECT DISTINCT anonymous_id
      FROM events
      `
    )
    .all() as { anonymous_id: string }[];

  const members: AudienceMember[] = [];

  for (const user of users) {
    const evidence = [];
    let matchesAllConditions = true;

    for (const condition of request.conditions) {
      const observedCount = getObservedCount(
        user.anonymous_id,
        condition,
        request.asOf
      );

      evidence.push({
        eventType: condition.eventType,
        observedCount,
      });

      if (!conditionMatches(observedCount, condition)) {
        matchesAllConditions = false;
        break;
      }
    }

    if (matchesAllConditions) {
      members.push({
        anonymousId: user.anonymous_id,
        evidence,
      });
    }
  }

  return members;
}