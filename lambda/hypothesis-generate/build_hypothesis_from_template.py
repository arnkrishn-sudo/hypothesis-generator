def build_hypothesis_from_template(input_data: dict) -> str:
    """Build If X / Then Y / Because Z hypothesis from structured form input."""
    audience = (input_data.get("targetAudience") or "").strip()
    audience_clause = f" for {audience}" if audience else ""

    direction = (input_data.get("direction") or "").strip().lower()
    expected_outcome = (input_data.get("expectedOutcome") or "").strip()
    y_clause = f"{expected_outcome} will {direction}"

    decision_metric = (input_data.get("decisionMetric") or "").strip()
    if decision_metric:
        y_clause += f", measured by {decision_metric}"

    proposed_change = (input_data.get("proposedChange") or "").strip()
    location = (input_data.get("location") or "").strip()
    reasoning = (input_data.get("reasoning") or "").strip()

    return (
        f"If {proposed_change} at {location}{audience_clause}, "
        f"then {y_clause}, because {reasoning}."
    )
