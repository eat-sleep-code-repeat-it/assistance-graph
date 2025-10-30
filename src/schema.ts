import { createSchema } from 'graphql-yoga'
 
const typeDefinitions = /* GraphQL */ `
  type Query {
    info: String!
    questionnaires: [Questionnaire!]!
    questionnaire(id: String, version: Int): [Questionnaire!]!
  }

  type Mutation {
    createQuestionnaire(input: QuestionnaireInput!): Questionnaire!
    updateQuestionnaire(id: String!, input: QuestionnaireInput!): Questionnaire!
  }

  input QuestionnaireInput {
    version: Int!
    sections: [SectionInput!]!
  }

  input SectionInput {
    viewGroups: [ViewGroupInput!]!
  }

  input ViewGroupInput {
    viewId: String!
    name: String!
    titleText: String!
    subTitleText: String
    bodyText: String
    questions: [QuestionInput!]!
  }

  input QuestionInput {
    name: String!
    keyName: String!
    text: String!
    type: String!
    options: String
    order: Int!
    required: Boolean!
    yesText: String
    noText: String
    defaultValue: String
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

const questionnaires: Questionnaire[] = [ 
]

type QuestionnaireInput = {
  version: number
  sections: Section[]
}

const resolvers = {
  Query: {
    info: () => `This is the API of assistance-graph`,
    questionnaires: () => questionnaires,
    questionnaire: (_: any, { id, version }: { id?: string, version?: number }) => {
      return questionnaires.filter(q => {
        if (id && version) {
          return q.id === id && q.version === version;
        }
        if (id) {
          return q.id === id;
        }
        if (version) {
          return q.version === version;
        }
        return false; // If no parameters provided, return empty array
      });
    }
  },
  Mutation: {
    createQuestionnaire: (_: any, { input }: { input: QuestionnaireInput }) => {
      const newQuestionnaire: Questionnaire = {
        id: String(questionnaires.length + 1),
        version: input.version,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sections: input.sections
      }
      questionnaires.push(newQuestionnaire)
      return newQuestionnaire
    },
    updateQuestionnaire: (_: any, { id, input }: { id: string, input: QuestionnaireInput }) => {
      const index = questionnaires.findIndex(q => q.id === id)
      if (index === -1) {
        throw new Error(`Questionnaire with id ${id} not found`)
      }
      const updatedQuestionnaire: Questionnaire = {
        ...questionnaires[index],
        ...input,
        updatedAt: new Date().toISOString()
      }
      questionnaires[index] = updatedQuestionnaire
      return updatedQuestionnaire
    }
  }
}
 
export const schema = createSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})