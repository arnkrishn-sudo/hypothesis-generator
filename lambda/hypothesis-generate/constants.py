VALID_MODEL_IDS = {
    "amazon.nova-pro-v1:0",
    "anthropic.claude-sonnet-4-5-20250929-v1:0",
    "anthropic.claude-haiku-4-5-20251001-v1:0",
    "meta.llama3-70b-instruct-v1:0",
    "meta.llama3-8b-instruct-v1:0",
    "openai.gpt-oss-20b-1:0",
    "google.gemma-3-4b-it",
    "qwen.qwen3-vl-235b-a22b",
}

RUBRIC_LABELS = [
    "X – Clear change",
    "X – Located/contextualized change",
    "Y – Observable outcome",
    "Direction stated",
    "Z – Reasoning mechanism",
    "Measurement leakage",
]

CORS_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
}
