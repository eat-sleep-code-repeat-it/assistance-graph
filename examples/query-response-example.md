```js
{
  "data": {
    "questionnaire": {  // questionnaire
      "sections": [ // domain such as property, hardship and etc
        {   // for certain domain e.g property
          "viewGroups": [   // a group of questions on the same page, at least one question
            {
              "viewId": "string",
              "name": "string",
              "titleText": "string",
              "subTitleText": "string",
              "bodyText": "string",
              "questions": [    // all questions in this group/page
                {
                  "name": "string",
                  "keyName": "string",
                  "text": "string",
                  "type": "string",
                  "options": "string",
                  "order": 0,
                  "required": true,
                  "yesText": "string",
                  "noText": "string",
                  "defaultValue": "string"
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```
