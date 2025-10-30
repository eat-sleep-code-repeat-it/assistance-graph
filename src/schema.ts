import { createSchema } from 'graphql-yoga'
 
const typeDefinitions = /* GraphQL */ `
  type Query {
    info: String!
    questionnaireTemplate: [Questionnaire!]!
  }
 
  type Question {
    name: String
    keyName: String
    text: String
    type: String 
    options: String 
    order: Int
    required: Boolean
    yesText: String
    noText: String
    defaultValue: String
  }

  type ViewGroup {
    viewId: String
    name: String  
    titleText: String
    subTitleText: String
    bodyText: String
    questions: [Question!]!   
  }

  type Section  {
    viewGroups: [ViewGroup!]!
  }

  type Questionnaire  {
    id: String
    version: Int!
    createdAt: String!
    updatedAt: String!    
    sections: [Section!]!   
  }
`

type Question = {
  name: string
  keyName: string
  text: string
  type: string  // YesNo, Radio, Input, Checkbox
  options: string // array of (selected,text,value,inputGroup )
  order: number
  required: boolean
  yesText?: string
  noText?: string
  defaultValue?: string
}

type ViewGroup = {
  viewId: string
  name: string  
  titleText: string
  subTitleText: string
  bodyText: string
  questions: Question[]   
}

type Section = {
  viewGroups: ViewGroup[]
}

type Questionnaire = {
  id: string
  createdAt: string
  updatedAt: string
  version: number
  sections: Section[]   
}

const questions: Question[] = [
  {
    name: 'string',
    keyName: 'string',
    text: 'string',
    type: 'string',  // YesNo, Radio, Input, Checkbox
    options: 'string', // array of (selected,text,value,inputGroup )
    order: 0,
    required: true,
    yesText: 'string',
    noText: 'string',
    defaultValue: 'string'  
  }
]

const viewGroups: ViewGroup[] = [
  {
    viewId: 'string',
    name: 'string'  ,
    titleText: 'string',
    subTitleText: 'string',
    bodyText: 'string',
    questions: questions 
  }
] 

const sections: Section[] = [
  {
    viewGroups: viewGroups
  }
]

const questionnaires: Questionnaire[] = [
  {
    id: '1',
    version: 1,
    createdAt: 'String',
    updatedAt: 'String',  
    sections: sections
  },
  {
    id: '1',
    version: 1,
    createdAt: 'String2',
    updatedAt: 'String2',  
    sections: sections
  }
]

const resolvers = {
  Query: {
    info: () => `This is the API of assistance-graph`,
    questionnaireTemplate: () => questionnaires
  }
}
 
export const schema = createSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})