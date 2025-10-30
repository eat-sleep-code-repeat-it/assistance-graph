// 1
import { PrismaClient } from '@prisma/client'
 
// 2
const prisma = new PrismaClient()

// example: create a questionnaire
async function createQuestionnaire() {
    
    return await prisma.questionnaire.create({
    data: {
        version: 1,
        sections: {
        create: [
            {
            viewGroups: {
                create: [
                {
                    viewId: 'intro',
                    name: 'Introduction',
                    titleText: 'Welcome',
                    questions: {
                    create: [
                        { name: 'consent', keyName: 'userConsent', text: 'Do you agree?', type: 'YesNo', order: 1, required: true }
                    ]
                    }
                }
                ]
            }
            }
        ]
        }
    },
    include: { sections: { include: { viewGroups: { include: { questions: true } } } } }
    })

}

// 3
async function main() {
  const allLinks = await prisma.questionnaire.findMany()
  console.log(allLinks)

  // example: create a questionnaire
  const newOne = await createQuestionnaire()

  const bllLinks = await prisma.questionnaire.findMany()
  console.log(allLinks)
}
 
// 4
main()
  // 5
  .finally(async () => {
    await prisma.$disconnect()
  })