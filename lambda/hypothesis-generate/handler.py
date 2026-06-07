import json
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed

from bedrock import invoke_coach
from build_hypothesis_from_template import build_hypothesis_from_template
from constants import CORS_HEADERS, VALID_MODEL_IDS
from parse_coach_response import parse_coach_response

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def _response(status_code: int, body: dict) -> dict:
    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": json.dumps(body),
    }


def _evaluate_model(model_id: str, generated_hypothesis: str) -> dict:
    coach_raw = invoke_coach(model_id, generated_hypothesis)
    parsed = parse_coach_response(coach_raw)
    return {
        "modelId": model_id,
        "generatedHypothesis": generated_hypothesis,
        **parsed,
    }


def handler(event, context):
    try:
        if event.get("httpMethod") == "OPTIONS" or event.get("requestContext", {}).get(
            "http", {}
        ).get("method") == "OPTIONS":
            return _response(200, {"ok": True})

        raw_body = event.get("body") or "{}"
        if event.get("isBase64Encoded"):
            import base64

            raw_body = base64.b64decode(raw_body).decode("utf-8")

        body = json.loads(raw_body)
        input_data = body.get("input")
        selected_models = body.get("selectedModels") or []

        if not input_data or not selected_models:
            return _response(400, {"error": "input and selectedModels are required"})

        invalid = [model_id for model_id in selected_models if model_id not in VALID_MODEL_IDS]
        if invalid:
            return _response(
                400,
                {"error": f"Invalid model IDs: {', '.join(invalid)}"},
            )

        generated_hypothesis = build_hypothesis_from_template(input_data)
        results = []

        failures = []

        # Evaluate models concurrently; skip individual failures instead of failing the batch
        with ThreadPoolExecutor(max_workers=min(len(selected_models), 4)) as executor:
            futures = {
                executor.submit(_evaluate_model, model_id, generated_hypothesis): model_id
                for model_id in selected_models
            }
            for future in as_completed(futures):
                model_id = futures[future]
                try:
                    results.append(future.result())
                except Exception as error:
                    logger.error("Coach evaluation failed for %s: %s", model_id, error)
                    failures.append({"modelId": model_id, "error": str(error)})

        if not results:
            return _response(
                502,
                {
                    "error": "All model evaluations failed",
                    "failures": failures,
                },
            )

        results.sort(key=lambda item: item.get("score", 0))
        body = {"results": results}
        if failures:
            body["failures"] = failures
        return _response(200, body)

    except json.JSONDecodeError:
        return _response(400, {"error": "Invalid JSON body"})
    except Exception as error:
        logger.exception("hypothesis-generate error: %s", error)
        return _response(500, {"error": "Internal server error"})
