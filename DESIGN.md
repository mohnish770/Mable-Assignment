# Design

## 1. Basic Architecture

The project has two parts:

```text
Frontend (React)
      |
      | API request
      v
Backend (Node + Express)
      |
      v
SQLite Database
```

The frontend is used to create the audience rules and show the results.

The backend receives the rules, checks the events in SQLite, and returns the matching users.

The frontend does not calculate the audience itself.

## 2. Database

I used SQLite because it is simple to set up and is enough for the synthetic data used in this assignment.

The database contains anonymous events with:

- `anonymous_id`
- `event_type`
- `occurred_at`

The supported events are:

- `page_view`
- `product_view`
- `add_to_cart`
- `checkout_started`
- `purchase`

## 3. Audience Evaluation

Each audience can have multiple conditions.

All conditions must be satisfied for a user to match.

For example:

```text
product_view >= 2
AND
purchase = 0
```

The backend counts the events for each user and checks the selected operator.

The supported operators are:

- `at_least`
- `exactly`

The backend also returns the event counts as evidence so the operator can understand why a user matched.

## 4. Time Window

The request contains an `asOf` timestamp.

The evaluator uses this timestamp instead of the server's current time.

For example, with:

```text
asOf = 2026-09-29
withinDays = 7
```

the evaluator checks the events in the seven-day period before that date.

This makes the same request produce the same result even if it is run at a different time.

## 5. Validation

The backend validates the request before evaluating it.

It checks things such as:

- Event type
- Operator
- Event count
- Number of days
- `asOf` date
- Required fields

Invalid requests return an error response instead of being evaluated.