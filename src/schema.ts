import { createSchema } from 'graphql-yoga'
import type { GraphQLContext } from './context'
 
const typeDefinitions = /* GraphQL */ `
  type Query {
    info: String!
    questionnaires: [Questionnaire!]!
    questionnaire(id: String!): Questionnaire
    questionnaireVersion(questionnaireId: String!, version: Int!): QuestionnaireVersion
    questionnaireResponses(versionId: String!): [QuestionnaireResponse!]!
    questionnaireResponse(id: String!): QuestionnaireResponse
  }

  type Mutation {
    createQuestionnaire(input: QuestionnaireCreateInput!): Questionnaire!
    updateQuestionnaire(id: String!, input: QuestionnaireCreateInput!): QuestionnaireVersion!
    createQuestionnaireResponse(input: QuestionnaireResponseCreateInput!): QuestionnaireResponse!
    createQuestionnaireResponseByVersion(input: QuestionnaireResponseByVersionCreateInput!): QuestionnaireResponse!
    updateQuestionnaireResponse(id: String!, input: QuestionnaireResponseUpdateInput!): QuestionnaireResponse!
    submitQuestionnaireResponse(id: String!): QuestionnaireResponse!
  }

  input QuestionnaireCreateInput {
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
    id: String!
    currentVersion: Int!
    createdAt: String!
    updatedAt: String!    
    versions: [QuestionnaireVersion!]!
  }

  type QuestionnaireVersion {
    id: String!
    questionnaireId: String!
    version: Int!
    sections: [Section!]!
    responses: [QuestionnaireResponse!]!
    createdAt: String!
  }

  type QuestionnaireResponse {
    id: String!
    versionId: String!
    questionnaireVersion: QuestionnaireVersion!
    respondentId: String
    status: String!
    answers: String!
    createdAt: String!
    updatedAt: String!
    submittedAt: String
  }

  input QuestionnaireResponseCreateInput {
    versionId: String!
    respondentId: String
    answers: String!
  }

  input QuestionnaireResponseByVersionCreateInput {
    questionnaireId: String!
    version: Int!
    respondentId: String
    answers: String!
  }

  input QuestionnaireResponseUpdateInput {
    answers: String!
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
          versions: {
            include: {
              sections: {
                include: {
                  viewGroups: {
                    include: {
                      questions: true
                    }
                  }
                }
              },
              responses: true
            }
          }
        }
      })
    },
    questionnaire: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      return context.prisma.questionnaire.findUnique({
        where: { id },
        include: {
          versions: {
            include: {
              sections: {
                include: {
                  viewGroups: {
                    include: { questions: true }
                  }
                }
              },
              responses: true
            }
          }
        }
      })
    },
    questionnaireVersion: async (_: any, { questionnaireId, version }: { questionnaireId: string, version: number }, context: GraphQLContext) => {
      return context.prisma.questionnaireVersion.findUnique({
        where: { questionnaireId_version: { questionnaireId, version } },
        include: {
          sections: {
            include: {
              viewGroups: { include: { questions: true } }
            }
          },
          responses: true
        }
      })
    },
    questionnaireResponses: async (_: any, { versionId }: { versionId: string }, context: GraphQLContext) => {
      return context.prisma.questionnaireResponse.findMany({
        where: { versionId },
        include: {
          questionnaireVersion: {
            include: {
              sections: { include: { viewGroups: { include: { questions: true } } } }
            }
          }
        }
      })
    },
    questionnaireResponse: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      return context.prisma.questionnaireResponse.findUnique({
        where: { id },
        include: {
          questionnaireVersion: { include: { sections: { include: { viewGroups: { include: { questions: true } } } } } }
        }
      })
    }
  },
  Mutation: {
    createQuestionnaire: async (_: any, { input }: { input: any }, context: GraphQLContext) => {
      return context.prisma.questionnaire.create({
        data: {
          currentVersion: 1,
          versions: {
            create: {
              version: 1,
              sections: {
                create: input.sections.map((section: any) => ({
                  viewGroups: {
                    create: section.viewGroups.map((vg: any) => ({
                      viewId: vg.viewId,
                      name: vg.name,
                      titleText: vg.titleText,
                      subTitleText: vg.subTitleText,
                      bodyText: vg.bodyText,
                      questions: { create: vg.questions.map((q: any) => ({
                        name: q.name,
                        keyName: q.keyName,
                        text: q.text,
                        type: q.type,
                        options: q.options,
                        order: q.order,
                        required: q.required,
                        yesText: q.yesText,
                        noText: q.noText,
                        defaultValue: q.defaultValue
                      })) }
                    }))
                  }
                }))
              }
            }
          }
        },
        include: {
          versions: {
            include: { sections: { include: { viewGroups: { include: { questions: true } } } }, responses: true }
          }
        }
      })
    },
    updateQuestionnaire: async (_: any, { id, input }: { id: string, input: any }, context: GraphQLContext) => {
      const current = await context.prisma.questionnaire.findUnique({ where: { id } });
      if (!current) throw new Error(`Questionnaire not found with id ${id}`);
      const newVersionNumber = current.currentVersion + 1;
      const newVersion = await context.prisma.questionnaireVersion.create({
        data: {
          questionnaireId: id,
          version: newVersionNumber,
          sections: {
            create: input.sections.map((section: any) => ({
              viewGroups: {
                create: section.viewGroups.map((vg: any) => ({
                  viewId: vg.viewId,
                  name: vg.name,
                  titleText: vg.titleText,
                  subTitleText: vg.subTitleText,
                  bodyText: vg.bodyText,
                  questions: { create: vg.questions.map((q: any) => ({
                    name: q.name,
                    keyName: q.keyName,
                    text: q.text,
                    type: q.type,
                    options: q.options,
                    order: q.order,
                    required: q.required,
                    yesText: q.yesText,
                    noText: q.noText,
                    defaultValue: q.defaultValue
                  })) }
                }))
              }
            }))
          }
        },
        include: { sections: { include: { viewGroups: { include: { questions: true } } } } }
      });
      await context.prisma.questionnaire.update({ where: { id }, data: { currentVersion: newVersionNumber } });
      return newVersion;
    },
    createQuestionnaireResponse: async (_: any, { input }: { input: { versionId: string, respondentId?: string, answers: string } }, context: GraphQLContext) => {
      const version = await context.prisma.questionnaireVersion.findUnique({ where: { id: input.versionId } });
      if (!version) throw new Error(`Questionnaire version not found: ${input.versionId}`);
      return context.prisma.questionnaireResponse.create({
        data: {
          versionId: input.versionId,
          respondentId: input.respondentId,
          status: 'in_progress',
          answers: input.answers
        },
        include: { questionnaireVersion: { include: { sections: { include: { viewGroups: { include: { questions: true } } } }, responses: true } } }
      })
    },
    createQuestionnaireResponseByVersion: async (_: any, { input }: { input: { questionnaireId: string, version: number, respondentId?: string, answers: string } }, context: GraphQLContext) => {
      // 1. Check that questionnaire exists and version isn't higher than currentVersion
      const questionnaire = await context.prisma.questionnaire.findUnique({
        where: { id: input.questionnaireId }
      });
      if (!questionnaire) {
        throw new Error(`Questionnaire not found: ${input.questionnaireId}`);
      }
      if (input.version > questionnaire.currentVersion) {
        throw new Error(`Version ${input.version} is higher than the current version (${questionnaire.currentVersion})`);
      }

      // 2. Look up the specific version with its questions
      const version = await context.prisma.questionnaireVersion.findUnique({
        where: { 
          questionnaireId_version: {
            questionnaireId: input.questionnaireId,
            version: input.version
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
      });
      if (!version) {
        throw new Error(`Version ${input.version} not found for questionnaire ${input.questionnaireId}`);
      }

      // 3. Parse and validate answers against required questions
      let answers: Record<string, any>;
      try {
        answers = JSON.parse(input.answers);
      } catch (e: any) {
        throw new Error(`Invalid answers JSON: ${e?.message || 'Parse error'}`);
      }

      // Collect all questions from all sections/viewGroups
      const allQuestions = version.sections.flatMap(section =>
        section.viewGroups.flatMap(group =>
          group.questions
        )
      );

      // Check required questions are answered
      const missingRequired = allQuestions
        .filter(q => q.required && !answers.hasOwnProperty(q.keyName))
        .map(q => q.keyName);

      if (missingRequired.length > 0) {
        throw new Error(`Missing answers for required questions: ${missingRequired.join(', ')}`);
      }

      // Check answer types
      const invalidAnswers = allQuestions
        .filter(q => answers.hasOwnProperty(q.keyName))
        .filter(q => {
          const answer = answers[q.keyName];
          switch (q.type) {
            case 'YesNo':
              return typeof answer !== 'boolean';
            case 'Input':
              return typeof answer !== 'string';
            case 'Radio':
              return typeof answer !== 'string' || (q.options && !JSON.parse(q.options || '[]').includes(answer));
            case 'Checkbox':
              return !Array.isArray(answer) || (q.options && 
                !answer.every(a => JSON.parse(q.options || '[]').includes(a)));
            default:
              return false;
          }
        })
        .map(q => q.keyName);

      if (invalidAnswers.length > 0) {
        throw new Error(`Invalid answer types for questions: ${invalidAnswers.join(', ')}`);
      }
      
      // 4. Create the response if validation passed
      return context.prisma.questionnaireResponse.create({
        data: {
          versionId: version.id,
          respondentId: input.respondentId,
          status: 'in_progress',
          answers: input.answers
        },
        include: { 
          questionnaireVersion: { 
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
          } 
        }
      })
    },
    updateQuestionnaireResponse: async (_: any, { id, input }: { id: string, input: { answers: string } }, context: GraphQLContext) => {
      return context.prisma.questionnaireResponse.update({
        where: { id },
        data: { answers: input.answers },
        include: { questionnaireVersion: { include: { sections: { include: { viewGroups: { include: { questions: true } } } }, responses: true } } }
      })
    },
    submitQuestionnaireResponse: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      return context.prisma.questionnaireResponse.update({
        where: { id },
        data: { status: 'completed', submittedAt: new Date() },
        include: { questionnaireVersion: { include: { sections: { include: { viewGroups: { include: { questions: true } } } }, responses: true } } }
      })
    }
  }
}
 
export const schema = createSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})