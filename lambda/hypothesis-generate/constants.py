VALID_MODEL_IDS = {
    "amazon.nova-pro-v1:0",
    "anthropic.claude-3-sonnet-20240229-v1:0",
    "anthropic.claude-3-haiku-20240307-v1:0",
    "cohere.command-r-plus-v1:0",
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
