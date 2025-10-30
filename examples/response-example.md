```js
Query questionnaire responses:

# Get all responses for a questionnaire
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
          }
        }
      }
    }
  }
}


// Create a new response:
mutation {
  createQuestionnaireResponse(input: {
    questionnaireId: "ef5e4f13-f099-4598-a560-2c595aea7b9a"
    answers: "{\"question1\": \"answer1\"}"
  }) {
    id
    status
    answers
  }
}

// Get a specific response
query {
  questionnaireResponse(id: "f5c00d39-62e5-49e5-9b5f-30e2609ae934") {
    id
    status
    answers
    submittedAt
  }
}

// Update a response:
mutation {
  updateQuestionnaireResponse(
    id: "f5c00d39-62e5-49e5-9b5f-30e2609ae934"
    input: {
      answers: "{\"question1\": \"updated-answer\"}"
    }
  ) {
    id
    status
    answers
    updatedAt
  }
}

// Submit a response:
mutation {
  submitQuestionnaireResponse(id: "f5c00d39-62e5-49e5-9b5f-30e2609ae934") {
    id
    status
    submittedAt
  }
}

```
