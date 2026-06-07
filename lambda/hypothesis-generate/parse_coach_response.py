import re
from typing import Any

from constants import RUBRIC_LABELS


def _parse_rubric_line(raw: str, criterion: str, classification: str) -> dict[str, Any]:
    escaped = re.escape(criterion)
    pattern = rf"{escaped}[:\s]+(Pass|Needs work|None detected|Present)[^\n]*"
    match = re.search(pattern, raw, re.IGNORECASE)
    line = match.group(0) if match else ""

    passed = bool(
        re.search(r"pass", line, re.IGNORECASE)
        or re.search(r"none detected", line, re.IGNORECASE)
        or (
            not re.search(r"needs work", line, re.IGNORECASE)
            and not re.search(r"present", line, re.IGNORECASE)
            and classification == "Strong Hypothesis"
        )
    )

    comment = re.sub(r"^[^:]*:\s*", "", line, flags=re.IGNORECASE).strip()
    if not comment:
        comment = "No comment provided."

    # Strip leading status tokens from comment for cleaner display
    comment = re.sub(
        r"^(Pass|Needs work|None detected|Present)\s*[-—]?\s*",
        "",
        comment,
        flags=re.IGNORECASE,
    ).strip() or comment

    return {"criterion": criterion, "passed": passed, "comment": comment}


def parse_coach_response(raw: str) -> dict[str, Any]:
    classification = (
        "Strong Hypothesis"
        if re.search(r"strong hypothesis", raw, re.IGNORECASE)
        else "Needs Improvement"
    )

    rubric = [_parse_rubric_line(raw, label, classification) for label in RUBRIC_LABELS]
    score = sum(1 for item in rubric if item["passed"])

    feedback_match = re.search(
        r"coaching feedback[:\s]*([\s\S]*?)(?=suggested rewrite|alternative|$)",
        raw,
        re.IGNORECASE,
    )
    suggestions = []
    if feedback_match:
        for line in feedback_match.group(1).split("\n"):
            cleaned = re.sub(r"^[-*•]\s*", "", line).strip()
            if cleaned:
                suggestions.append(cleaned)

    rewrite_match = re.search(
        r"suggested rewrite[^:]*:?\s*([\s\S]*?)(?=alternative|$)",
        raw,
        re.IGNORECASE,
    )
    improved_hypothesis = None
    if rewrite_match:
        first_line = rewrite_match.group(1).strip().split("\n")[0].strip()
        first_line = re.sub(r"^[-*•]\s*", "", first_line)
        if first_line:
            improved_hypothesis = first_line

    alt_match = re.search(r"alternative[^:]*:?\s*([\s\S]*?)$", raw, re.IGNORECASE)
    alternative_mechanisms = []
    if alt_match:
        for line in alt_match.group(1).split("\n"):
            cleaned = re.sub(r"^[-*•]\s*", "", line).strip()
            if cleaned:
                alternative_mechanisms.append(cleaned)
        alternative_mechanisms = alternative_mechanisms[:2]

    result: dict[str, Any] = {
        "classification": classification,
        "score": score,
        "rubric": rubric,
        "suggestions": suggestions or ["Review coach output for details."],
    }

    if improved_hypothesis:
        result["improvedHypothesis"] = improved_hypothesis

    if alternative_mechanisms:
        result["alternativeMechanisms"] = alternative_mechanisms

    return result
