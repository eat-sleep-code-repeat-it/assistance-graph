```js

// 1.Basic info query:
query {
  info
}

// 2.Get full questionnaire:
query {
  questionnaires {
    id
    version
    createdAt
    updatedAt
    sections {
      viewGroups {
          viewId
          name
          titleText
          subTitleText
          bodyText
          questions {
            name
            keyName
            text
            type
            options
            order
            required
            yesText
            noText
            defaultValue
          }
      }
    }
  }
}

// 3.Get just the views without questions:
query {
  questionnaires {
    id
    version
    createdAt
    updatedAt
    sections {
      viewGroups {
          viewId
          name
          titleText
          subTitleText
          bodyText
      }
    }
  }
}

// 4. Get All Questions in All ViewGroups
query {
  questionnaires {
    id
    version
    createdAt
    updatedAt
    sections {
      viewGroups {
        questions {
          name
          text
          type
        }
      }
    }
  }
}

// 4.Get just the questions from all views:
query {
  questionnaires {
    id
    version
    createdAt
    updatedAt
    sections {
      viewGroups {
          name
          questions {
            name
            text
            type
            options
            required
          }
      }
    }
  }
}

// 5.query a questionnaire by ID 
query {
  questionnaire(id: "1") {
    id
    version
    createdAt
    updatedAt
    sections {
      viewGroups {
        viewId
        name
        titleText
        questions {
          name
          text
          type
        }
      }
    }
  }
}

// 6.query a questionnaire by version 
query {
  questionnaire(version: 1) {
    id
    version
    createdAt
    updatedAt
  }
}

// 7.query a questionnaire by both ID and version 
query {
  questionnaire(id: "1", version: 1) {
    id
    version
    createdAt
    updatedAt
    sections {
      viewGroups {
        viewId
        name
      }
    }
  }
}