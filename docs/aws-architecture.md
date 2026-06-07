# AWS Architecture — Hypothesis Generator

## Overview

```
Amplify Frontend → API Gateway → Lambda (Python) → Amazon Bedrock (Coach only)
                                      ↘ CloudWatch Logs
```

The frontend never calls Bedrock directly. All LLM calls happen in Lambda.

## Endpoint

**POST** `/hypothesis/generate`

### Request

```json
{
  "input": {
    "targetAudience": "string",
    "location": "string",
    "proposedChange": "string",
    "userProblem": "string",
    "expectedOutcome": "string",
    "direction": "Increase | Decrease | Shift",
    "reasoning": "string",
    "decisionMetric": "Conversion Rate | CTA CTR | Bounce Rate (optional)",
    "guardrailMetric": "optional",
    "notes": "optional"
  },
  "selectedModels": ["anthropic.claude-3-sonnet-20240229-v1:0"]
}
```

### Response

```json
{
  "results": [
    {
      "modelId": "anthropic.claude-3-sonnet-20240229-v1:0",
      "generatedHypothesis": "If ... then ... because ...",
      "classification": "Strong Hypothesis",
      "score": 6,
      "rubric": [{ "criterion": "X – Clear change", "passed": true, "comment": "..." }],
      "suggestions": ["..."],
      "improvedHypothesis": "If ... then ... because ...",
      "alternativeMechanisms": ["..."]
    }
  ]
}
```

## Processing Flow

1. **Template generation (no Bedrock):** `build_hypothesis_from_template(input)` produces one raw hypothesis using If X / Then Y / Because Z.
2. **Coach evaluation (Bedrock, per model):** `invoke_coach()` sends the hypothesis to each selected model with the Hypothesis Coach system prompt via Bedrock Converse.
3. **Parse:** `parse_coach_response()` maps coach output to `ModelResult` fields.
4. **Return:** Results sorted descending by coach score.

## Lambda (Python)

| File | Purpose |
|------|---------|
| `lambda/hypothesis-generate/handler.py` | API Gateway entry point |
| `lambda/hypothesis-generate/build_hypothesis_from_template.py` | If X / Then Y / Because Z template |
| `lambda/hypothesis-generate/bedrock.py` | Bedrock Converse client |
| `lambda/hypothesis-generate/parse_coach_response.py` | Coach output parser |
| `lambda/hypothesis-generate/prompts/hypothesis_coach.py` | Coach system prompt |
| `lambda/hypothesis-generate/constants.py` | Model pool + CORS headers |

- **Handler:** `handler.handler`
- **Runtime:** Python 3.12
- **Dependencies:** `boto3` (see `requirements.txt`)

See [lambda/hypothesis-generate/README.md](../lambda/hypothesis-generate/README.md) for packaging and deployment.

## Bedrock Model Pool

| modelId | displayName |
|---------|-------------|
| `amazon.nova-pro-v1:0` | Amazon Nova Pro |
| `amazon.nova-lite-v1:0` | Amazon Nova Lite |
| `mistral.mistral-large-3-675b-instruct` | Mistral Large 3 |
| `meta.llama3-70b-instruct-v1:0` | Llama 3 70B Instruct |
| `meta.llama3-8b-instruct-v1:0` | Llama 3 8B Instruct |
| `openai.gpt-oss-20b-1:0` | OpenAI GPT OSS 20B |
| `google.gemma-3-4b-it` | Google Gemma 3 4B |
| `qwen.qwen3-vl-235b-a22b` | Qwen3 VL 235B |

## IAM Permissions

Lambda execution role needs:

- `bedrock:InvokeModel` and `bedrock:Converse` for each model in the pool
- `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`

## API Gateway

- Enable CORS for the Amplify frontend origin (or `*` for MVP)
- Lambda returns CORS headers; API Gateway should proxy them
- Integrate as **Lambda proxy** integration → `handler.handler`

## CloudWatch

Log group: `/aws/lambda/hypothesis-generate`

## Deferred Services

Not used in MVP:

- DynamoDB
- Cognito
- Step Functions
- S3 (data storage)
- OpenSearch
- QuickSight

## Frontend Integration

Set `VITE_HYPOTHESIS_API_URL` in Amplify environment variables to the API Gateway base URL. The frontend calls:

```
POST ${VITE_HYPOTHESIS_API_URL}/hypothesis/generate
```

Uncomment the fetch block in `src/services/hypothesisApi.ts` when the API is live.
