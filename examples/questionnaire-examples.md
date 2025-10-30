# Questionnaire Examples

## Query All Questionnaires
Get all questionnaires with their versions, sections, groups, and questions:
```graphql
query {
  questionnaires {
    id
    currentVersion
    createdAt
    updatedAt
    versions {
      id
      version
      createdAt
      sections {
        viewGroups {
          viewId
          name
          titleText
          questions {
            name
            keyName
            text
            type
            required
          }
        }
      }
      responses {
        id
        status
      }
    }
  }
}
```

## Query Specific Questionnaire
Get a questionnaire by ID and inspect a particular version (use `questionnaireVersion` to fetch a specific version by number):
```graphql
query {
  questionnaire(id: "ef5e4f13-f099-4598-a560-2c595aea7b9a") {
    id
    currentVersion
    createdAt
    versions {
      id
      version
      createdAt
      sections {
        viewGroups {
          name
          titleText
          questions {
            text
            type
            required
          }
        }
      }
    }
  }
}
```

## Create New Questionnaire
Create a questionnaire with nested sections, groups, and questions:
```graphql
mutation {
  createQuestionnaire(input: {
    version: 1
    sections: [
      {
        viewGroups: [
          {
            viewId: "intro"
            name: "Introduction"
            titleText: "Welcome to the Survey"
            subTitleText: "Please answer all questions"
            bodyText: "This survey helps us understand your needs"
            questions: [
              {
                name: "consent"
                keyName: "userConsent"
                text: "Do you agree to participate?"
                type: "YesNo"
                order: 1
                required: true,
                yesText: "Yes, I agree"
                noText: "No, I do not agree"
              },
              {
                name: "age"
                keyName: "userAge"
                text: "What is your age?"
                type: "Input"
                order: 2
                required: true
              }
            ]
          }
        ]
      }
    ]
  }) {
    id
    version
    createdAt
  }
}
```

## Update Existing Questionnaire
Update a questionnaire's content:
```graphql
mutation {
  updateQuestionnaire(
    id: "ef5e4f13-f099-4598-a560-2c595aea7b9a"
    input: {
      version: 2
      sections: [
        {
          viewGroups: [
            {
              viewId: "updated-intro"
              name: "Updated Introduction"
              titleText: "Welcome to the Updated Survey"
              questions: [
                {
                  name: "updatedConsent"
                  keyName: "userConsent"
                  text: "Do you agree to the updated terms?"
                  type: "YesNo"
                  order: 1
                  required: true
                }
              ]
            }
          ]
        }
      ]
    }
  ) {
    id
    version
    updatedAt
  }
}
```

## Question Types
- `YesNo`: Boolean choice with optional custom yes/no text
- `Input`: Free text input
- `Radio`: Single choice from options
- `Checkbox`: Multiple choice from options

## ViewGroup Structure
- `viewId`: Unique identifier for the view group
- `name`: Display name
- `titleText`: Main heading
- `subTitleText`: Optional subheading
- `bodyText`: Optional descriptive text
- `questions`: Array of questions in this group