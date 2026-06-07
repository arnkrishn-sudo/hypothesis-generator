import logging
import os
from functools import lru_cache

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from constants import resolve_bedrock_invoke_id
from prompts.hypothesis_coach import (
    HYPOTHESIS_COACH_SYSTEM_PROMPT,
    build_coach_user_message,
)

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


@lru_cache(maxsize=1)
def _get_bedrock_client():
    region = os.environ.get("AWS_REGION", os.environ.get("BEDROCK_REGION", "us-east-1"))
    return boto3.client("bedrock-runtime", region_name=region)


def invoke_coach(model_id: str, hypothesis: str) -> str:
    """Call Amazon Bedrock Converse API with the Hypothesis Coach prompt."""
    client = _get_bedrock_client()
    user_message = build_coach_user_message(hypothesis)
    bedrock_model_id = resolve_bedrock_invoke_id(model_id)

    try:
        response = client.converse(
            modelId=bedrock_model_id,
            system=[{"text": HYPOTHESIS_COACH_SYSTEM_PROMPT}],
            messages=[
                {
                    "role": "user",
                    "content": [{"text": user_message}],
                }
            ],
            inferenceConfig={
                "maxTokens": int(os.environ.get("BEDROCK_MAX_TOKENS", "2048")),
                "temperature": float(os.environ.get("BEDROCK_TEMPERATURE", "0.3")),
            },
        )
    except (ClientError, BotoCoreError) as error:
        logger.error("Bedrock converse failed for model %s: %s", model_id, error)
        raise

    content = response.get("output", {}).get("message", {}).get("content", [])
    text_blocks = [block["text"] for block in content if block.get("text")]

    if not text_blocks:
        raise ValueError(f"Empty coach response from model {model_id}")

    return "\n".join(text_blocks)
