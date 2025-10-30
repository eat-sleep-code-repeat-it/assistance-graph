import { createSchema } from 'graphql-yoga'
import type { GraphQLContext } from './context'
 
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

type QuestionnaireInput = {
  version: number
  sections: {
    viewGroups: {
      viewId: string
      name: string
      titleText: string
      subTitleText?: string
      bodyText?: string
      questions: {
        name: string
        keyName: string
        text: string
        type: string
        options?: string
        order: number
        required: boolean
        yesText?: string
        noText?: string
        defaultValue?: string
      }[]
    }[]
  }[]
}

const resolvers = {
  Query: {
    info: () => `This is the API of assistance-graph`,
    questionnaires: async (_: any, __: any, context: GraphQLContext) => {
      return context.prisma.questionnaire.findMany({
        include: {
          sections: {
            include: {
              viewGroups: {
                include: {
                  questions: true
                }
              }
            }
          }
        }
      })
    },
    questionnaire: async (_: any, { id, version }: { id?: string, version?: number }, context: GraphQLContext) => {
      return context.prisma.questionnaire.findMany({
        where: {
          AND: [
            id ? { id } : {},
            version ? { version } : {}
          ]
        },
        include: {
          sections: {
            include: {
              viewGroups: {
                include: {
                  questions: true
                }
              }
            }
          }
        }
      })
    }
  },
  Mutation: {
    createQuestionnaire: async (_: any, { input }: { input: QuestionnaireInput }, context: GraphQLContext) => {
      return context.prisma.questionnaire.create({
        data: {
          version: input.version,
          sections: {
            create: input.sections.map(section => ({
              viewGroups: {
                create: section.viewGroups.map(viewGroup => ({
                  viewId: viewGroup.viewId,
                  name: viewGroup.name,
                  titleText: viewGroup.titleText,
                  subTitleText: viewGroup.subTitleText,
                  bodyText: viewGroup.bodyText,
                  questions: {
                    create: viewGroup.questions.map(question => ({
                      name: question.name,
                      keyName: question.keyName,
                      text: question.text,
                      type: question.type,
                      options: question.options,
                      order: question.order,
                      required: question.required,
                      yesText: question.yesText,
                      noText: question.noText,
                      defaultValue: question.defaultValue
                    }))
                  }
                }))
              }
            }))
          }
        },
        include: {
          sections: {
            include: {
              viewGroups: {
                include: {
                  questions: true
                }
              }
            }
          }
        }
      })
    },
    updateQuestionnaire: async (_: any, { id, input }: { id: string, input: QuestionnaireInput }, context: GraphQLContext) => {
      // First, delete all related records (due to Prisma's limitation with nested updates)
      await context.prisma.question.deleteMany({
        where: {
          viewGroup: {
            section: {
              questionnaireId: id
            }
          }
        }
      })
      await context.prisma.viewGroup.deleteMany({
        where: {
          section: {
            questionnaireId: id
          }
        }
      })
      await context.prisma.section.deleteMany({
        where: {
          questionnaireId: id
        }
      })

      // Then update the questionnaire with new data
      return context.prisma.questionnaire.update({
        where: { id },
        data: {
          version: input.version,
          sections: {
            create: input.sections.map(section => ({
              viewGroups: {
                create: section.viewGroups.map(viewGroup => ({
                  viewId: viewGroup.viewId,
                  name: viewGroup.name,
                  titleText: viewGroup.titleText,
                  subTitleText: viewGroup.subTitleText,
                  bodyText: viewGroup.bodyText,
                  questions: {
                    create: viewGroup.questions.map(question => ({
                      name: question.name,
                      keyName: question.keyName,
                      text: question.text,
                      type: question.type,
                      options: question.options,
                      order: question.order,
                      required: question.required,
                      yesText: question.yesText,
                      noText: question.noText,
                      defaultValue: question.defaultValue
                    }))
                  }
                }))
              }
            }))
          }
        },
        include: {
          sections: {
            include: {
              viewGroups: {
                include: {
                  questions: true
                }
              }
            }
          }
        }
      })
    }
  }
}
 
export const schema = createSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})