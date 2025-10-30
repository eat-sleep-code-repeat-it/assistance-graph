# Questionnaire Response Examples

## Query questionnaire responses
Responses are stored per questionnaire version. To fetch responses you need a `versionId` (the UUID of a QuestionnaireVersion). You can get that `versionId` from the `questionnaireVersion` query or from the `questionnaires` query.

Returns an empty array if either:
- The questionnaire (version) doesn't exist
- The questionnaire version exists but has no responses

```graphql
# Example: fetch responses for a specific versionId
query {
  questionnaireResponses(versionId: "e41e6b0f-b14c-4e3f-9983-95f01a9e3317") {
    id
    status
    answers
    submittedAt
    questionnaireVersion {
      id
      version
      sections {
        viewGroups {
          questions {
            text
            type
            keyName
          }
        }
      }
    }
  }
}
```

Example response when no responses exist:
```json
{
  "data": {
    "questionnaireResponses": []
  }
}
```

## Get a specific response
Query a single response by its ID:
```graphql
query {
  questionnaireResponse(id: "f5c00d39-62e5-49e5-9b5f-30e2609ae934") {
    id
    status
    answers
    submittedAt
    questionnaireVersion {
      id
      version
      sections {
        viewGroups {
          questions {
            keyName
            text
            type
          }
        }
      }
    }
  }
}
```

## Create a new response

There are two ways to create a response:

1. Using a version ID directly (if you already have it):
```graphql
mutation {
  createQuestionnaireResponse(input: {
    versionId: "e41e6b0f-b14c-4e3f-9983-95f01a9e3317"
    respondentId: "user-123"  # Optional
    answers: "{\"question1\": \"answer1\", \"consent\": true}"
  }) {
    id
    status        # Will be "in_progress"
    answers
    createdAt
    respondentId
    questionnaireVersion {
      id
      version
    }
  }
}
```

2. Using questionnaire ID and version number (more convenient):
```graphql
mutation {
  createQuestionnaireResponseByVersion(input: {
    questionnaireId: "841c8558-5ef9-4201-bbf3-6ca01d6f0f45"
    version: 2  # The version number you want to respond to
    respondentId: "user-123"  # Optional
    answers: "{\"question1\": \"answer1\", \"consent\": true}"
  }) {
    id
    status        # Will be "in_progress"
    answers
    createdAt
    respondentId
    questionnaireVersion {
      id
      version
    }
  }
}
```

## Update a response
Update an existing response's answers:
```graphql
mutation {
  updateQuestionnaireResponse(
    id: "f5c00d39-62e5-49e5-9b5f-30e2609ae934"
    input: {
      answers: "{\"question1\": \"updated answer\", \"consent\": true}"
    }
  ) {
    id
    status
    answers
    updatedAt
  }
}
```

## Submit a response
Mark a response as completed:
```graphql
mutation {
  submitQuestionnaireResponse(id: "f5c00d39-62e5-49e5-9b5f-30e2609ae934") {
    id
    status      # Will be set to "completed"
    submittedAt
    answers
  }
}
```

## Response States
- `in_progress`: Initial state when created
- `completed`: After submission

## Answer Format
The answers field expects a JSON string containing key-value pairs where:
- key: corresponds to the question's keyName
- value: the answer based on the question type

Example answers for different question types:
```json
{
  "consent": true,                    // For YesNo questions
  "age": "25",                       // For Input questions
  "preferences": ["a", "b", "c"],    // For Checkbox questions
  "choice": "option1"                // For Radio questions
}
```