import re
from typing import Any, Optional

from constants import RUBRIC_LABELS

_RUBRIC_STATUSES = ("Pass", "Needs work", "None detected", "Present")


def _normalize_coach_text(raw: str) -> str:
    """Strip common markdown wrappers so model output formats parse consistently."""
    text = raw.replace("\r\n", "\n")
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"^#{1,6}\s*", "", text, flags=re.MULTILINE)
    return text


def _find_rubric_line(normalized: str, criterion: str) -> str:
    escaped = re.escape(criterion)
    for line in normalized.split("\n"):
        stripped = line.strip().lstrip("-•* ").strip()
        if re.match(rf"^{escaped}\s*:", stripped, re.IGNORECASE):
            return stripped
    return ""


def _clean_rubric_comment(comment: str) -> str:
    comment = comment.strip()
    if not comment:
        return "No comment provided."

    comment = re.sub(r"^\(+|\)+$", "", comment).strip()
    comment = re.sub(r"^\*+|\*+$", "", comment).strip()
    return comment or "No comment provided."


def _rubric_item_passed(criterion: str, status: str) -> bool:
    status_lower = status.lower()
    if criterion == "Measurement leakage":
        return status_lower == "none detected"
    return status_lower == "pass"


def _parse_rubric_line(normalized: str, criterion: str) -> dict[str, Any]:
    line = _find_rubric_line(normalized, criterion)
    if not line:
        return {"criterion": criterion, "passed": False, "comment": "No comment provided."}

    after_label = re.split(r":\s*", line, maxsplit=1, flags=re.IGNORECASE)
    remainder = after_label[1] if len(after_label) > 1 else ""

    status_pattern = r"(Pass|Needs work|None detected|Present)\b"
    status_match = re.search(status_pattern, remainder, re.IGNORECASE)
    if not status_match:
        return {"criterion": criterion, "passed": False, "comment": "No comment provided."}

    status = status_match.group(1)
    passed = _rubric_item_passed(criterion, status)
    comment = _clean_rubric_comment(remainder[status_match.end() :])

    return {"criterion": criterion, "passed": passed, "comment": comment}


def _parse_suggestions(normalized: str) -> list[str]:
    feedback_match = re.search(
        r"coaching feedback[:\s]*([\s\S]*?)(?=suggested rewrite|alternative|$)",
        normalized,
        re.IGNORECASE,
    )
    if not feedback_match:
        return []

    suggestions = []
    for line in feedback_match.group(1).split("\n"):
        cleaned = re.sub(r"^[-*•\d.]+\s*", "", line).strip()
        cleaned = re.sub(r"^#{1,6}\s*", "", cleaned)
        if cleaned and not cleaned.startswith("---"):
            suggestions.append(cleaned)
    return suggestions


def _parse_improved_hypothesis(normalized: str) -> Optional[str]:
    rewrite_match = re.search(
        r"suggested rewrite[:\s]*([\s\S]*?)(?=alternative|\Z)",
        normalized,
        re.IGNORECASE,
    )
    if not rewrite_match:
        return None

    lines = []
    for line in rewrite_match.group(1).split("\n"):
        cleaned = re.sub(r"^[-*•]\s*", "", line).strip()
        if cleaned and not cleaned.startswith("---"):
            lines.append(cleaned)

    if not lines:
        return None

    return re.sub(r"\s+", " ", " ".join(lines)).strip()


def _parse_alternative_mechanisms(normalized: str) -> list[str]:
    alt_match = re.search(r"alternative[^:]*:?\s*([\s\S]*?)$", normalized, re.IGNORECASE)
    if not alt_match:
        return []

    alternatives = []
    for line in alt_match.group(1).split("\n"):
        cleaned = re.sub(r"^[-*•\d.]+\s*", "", line).strip()
        if cleaned and not cleaned.startswith("---"):
            alternatives.append(cleaned)
    return alternatives[:2]


def parse_coach_response(raw: str) -> dict[str, Any]:
    normalized = _normalize_coach_text(raw)

    classification = (
        "Strong Hypothesis"
        if re.search(r"strong hypothesis", normalized, re.IGNORECASE)
        else "Needs Improvement"
    )

    rubric = [_parse_rubric_line(normalized, label) for label in RUBRIC_LABELS]
    score = sum(1 for item in rubric if item["passed"])

    suggestions = _parse_suggestions(normalized)
    improved_hypothesis = _parse_improved_hypothesis(normalized)
    alternative_mechanisms = _parse_alternative_mechanisms(normalized)

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
