```js
// 1.Creating a new questionnaire:
mutation {
  createQuestionnaire(input: {
    version: 1
    sections: [
      {
        viewGroups: [
          {
            viewId: "section1"
            name: "Personal Information"
            titleText: "Personal Details"
            subTitleText: "Please provide your information"
            bodyText: "All fields marked with * are required"
            questions: [
              {
                name: "fullName"
                keyName: "fullName"
                text: "What is your full name?"
                type: "Input"
                order: 1
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
    updatedAt
  }
}

// Updating an existing questionnaire:
mutation {
  updateQuestionnaire(
    id: "df7f681a-388b-403c-beb7-77271d727292"
    input: {
      version: 2
      sections: [
        {
          viewGroups: [
            {
              viewId: "section1"
              name: "Updated Section"
              titleText: "Updated Title"
              subTitleText: "Updated Subtitle"
              bodyText: "Updated Body"
              questions: [
                {
                  name: "updatedQuestion"
                  keyName: "updatedKey"
                  text: "Updated question text?"
                  type: "YesNo"
                  order: 1
                  required: true
                  yesText: "Yes"
                  noText: "No"
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
    sections {
      viewGroups {
        name
        questions {
          text
        }
      }
    }
  }
}

```