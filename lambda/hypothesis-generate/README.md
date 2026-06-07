# Hypothesis Generate Lambda (Python)

Python 3.12 Lambda handler for `POST /hypothesis/generate`.

## Handler

- **Entry point:** `handler.handler`
- **Runtime:** Python 3.12
- **Architecture:** x86_64 or arm64

## Flow

1. `build_hypothesis_from_template()` — deterministic If / Then / Because string
2. `invoke_coach()` — Bedrock Converse per selected model
3. `parse_coach_response()` — map coach output to API `ModelResult` shape

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `AWS_REGION` | `us-east-1` | Bedrock client region |
| `BEDROCK_REGION` | — | Override region if different from Lambda |
| `BEDROCK_MAX_TOKENS` | `2048` | Max tokens per coach call |
| `BEDROCK_TEMPERATURE` | `0.3` | Coach temperature |

## IAM permissions

```json
{
  "Effect": "Allow",
  "Action": ["bedrock:InvokeModel", "bedrock:Converse"],
  "Resource": "arn:aws:bedrock:*::foundation-model/*"
}
```

## Package and deploy

```bash
cd lambda/hypothesis-generate
pip install -r requirements.txt -t package
cp *.py package/
cp -r prompts package/
cd package && zip -r ../hypothesis-generate.zip . && cd ..

aws lambda update-function-code \
  --function-name hypothesis-generate \
  --zip-file fileb://hypothesis-generate.zip
```

## Local syntax check

```bash
cd lambda/hypothesis-generate
python3 -m py_compile handler.py build_hypothesis_from_template.py parse_coach_response.py bedrock.py constants.py
```
