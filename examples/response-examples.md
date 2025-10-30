# Questionnaire Response Examples

## Query questionnaire responses
Get all responses for a specific questionnaire. Returns an empty array if either:
- The questionnaire doesn't exist
- The questionnaire exists but has no responses

```graphql
query {
  questionnaireResponses(questionnaireId: "ef5e4f13-f099-4598-a560-2c595aea7b9a") {
    id
    status
    answers
    submittedAt
    questionnaire {
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
```graphql
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
    questionnaire {
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
Create a response for a questionnaire:
```graphql
mutation {
  createQuestionnaireResponse(input: {
    questionnaireId: "ef5e4f13-f099-4598-a560-2c595aea7b9a"
    respondentId: "user-123"  # Optional
    answers: "{\"question1\": \"answer1\", \"consent\": true}"
  }) {
    id
    status        # Will be "in_progress"
    answers
    createdAt
    respondentId
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