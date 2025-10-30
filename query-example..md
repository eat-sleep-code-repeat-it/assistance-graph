```js

// 1.Basic info query:
query {
  info
}

// 2.Get full questionnaire:
query {
  questionnaire {
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
  questionnaire {
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
  questionnaire {
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
  questionnaire {
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




