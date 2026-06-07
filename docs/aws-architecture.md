# AWS Architecture — Hypothesis Generator

## Overview

```
Amplify Frontend → API Gateway → Lambda → Amazon Bedrock (Coach only)
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
    "direction": "Increase | Decrease | Reduce | Shift",
    "reasoning": "string",
    "decisionMetric": "optional",
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

1. **Template generation (no Bedrock):** `buildHypothesisFromTemplate(input)` produces one raw hypothesis using If X / Then Y / Because Z.
2. **Coach evaluation (Bedrock, per model):** Send the hypothesis to each selected model with the Hypothesis Coach system prompt.
3. **Parse:** `parseCoachResponse()` maps coach output to `ModelResult` fields.
4. **Return:** Results sorted descending by coach score.

## Bedrock Model Pool

| modelId | displayName |
|---------|-------------|
| `amazon.nova-pro-v1:0` | Amazon Nova Pro |
| `anthropic.claude-3-sonnet-20240229-v1:0` | Claude 3 Sonnet |
| `anthropic.claude-3-haiku-20240307-v1:0` | Claude 3 Haiku |
| `cohere.command-r-plus-v1:0` | Cohere Command R+ |
| `meta.llama3-8b-instruct-v1:0` | Llama 3 8B Instruct |
| `openai.gpt-oss-20b-1:0` | OpenAI GPT OSS 20B |
| `google.gemma-3-4b-it` | Google Gemma 3 4B |
| `qwen.qwen3-vl-235b-a22b` | Qwen3 VL 235B |

## IAM Permissions

Lambda execution role needs:

- `bedrock:InvokeModel` or `bedrock:Converse` for each model in the pool
- `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`

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

Set `VITE_HYPOTHESIS_API_URL` to the API Gateway base URL. The frontend calls:

```
POST ${VITE_HYPOTHESIS_API_URL}/hypothesis/generate
```
