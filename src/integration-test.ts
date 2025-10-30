import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Running clean integration test...')

  // Clean up before starting
  await prisma.questionnaireResponse.deleteMany()
  await prisma.question.deleteMany()
  await prisma.viewGroup.deleteMany()
  await prisma.section.deleteMany()
  await prisma.questionnaireVersion.deleteMany()
  await prisma.questionnaire.deleteMany()

  // 1) Create questionnaire with initial version (1)
  const created = await prisma.questionnaire.create({
    data: {
      versions: {
        create: [
          {
            version: 1,
            sections: {
              create: [
                {
                  viewGroups: {
                    create: [
                      {
                        viewId: 'intro-clean',
                        name: 'Intro Clean',
                        titleText: 'Welcome (clean test)',
                        questions: {
                          create: [
                            { name: 'name', keyName: 'fullName', text: 'Name', type: 'Input', order: 1, required: true },
                            { name: 'age', keyName: 'userAge', text: 'Age', type: 'Input', order: 2, required: true }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    },
    include: { versions: { include: { sections: { include: { viewGroups: { include: { questions: true } } } } } } }
  })

  const qId = created.id
  const v1 = created.versions[0]
  console.log('Created questionnaire', qId, 'version1', v1.id)

  // 2) Create version 2 (update)
  const v2 = await prisma.questionnaireVersion.create({
    data: {
      questionnaireId: qId,
      version: 2,
      sections: {
        create: [
          {
            viewGroups: {
              create: [
                {
                  viewId: 'intro-v2-clean',
                  name: 'Intro v2 Clean',
                  titleText: 'Welcome v2 (clean test)',
                  questions: {
                    create: [
                      { name: 'name', keyName: 'fullName', text: 'Name', type: 'Input', order: 1, required: true },
                      { name: 'age', keyName: 'userAge', text: 'Age', type: 'Input', order: 2, required: true },
                      { name: 'newsletter', keyName: 'wantsNewsletter', text: 'Newsletter', type: 'YesNo', order: 3, required: false }
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

  // update questionnaire.currentVersion to 2
  await prisma.questionnaire.update({ where: { id: qId }, data: { currentVersion: 2 } })
  console.log('Created version2', v2.id)

  // 3) Create response using versionId directly
  const resp1Answers = { fullName: 'Cleaner John', userAge: '40', wantsNewsletter: true }
  const resp1 = await prisma.questionnaireResponse.create({
    data: {
      versionId: v2.id,
      respondentId: 'clean-user-1',
      status: 'in_progress',
      answers: JSON.stringify(resp1Answers)
    }
  })
  console.log('Created response1', resp1.id)

  // 4) Create response using questionnaireId + version lookup
  const lookupV2 = await prisma.questionnaireVersion.findUnique({
    where: { questionnaireId_version: { questionnaireId: qId, version: 2 } }
  })
  if (!lookupV2) throw new Error('lookupV2 not found')

  const resp2Answers = { fullName: 'Cleaner Jane', userAge: '35', wantsNewsletter: false }
  const resp2 = await prisma.questionnaireResponse.create({
    data: {
      versionId: lookupV2.id,
      respondentId: 'clean-user-2',
      status: 'in_progress',
      answers: JSON.stringify(resp2Answers)
    }
  })
  console.log('Created response2', resp2.id)

  // 5) Submit both responses (update status)
  const s1 = await prisma.questionnaireResponse.update({ where: { id: resp1.id }, data: { status: 'completed', submittedAt: new Date() } })
  const s2 = await prisma.questionnaireResponse.update({ where: { id: resp2.id }, data: { status: 'completed', submittedAt: new Date() } })

  // 6) Assert using direct queries of known objects (avoid ambiguous counts)
  const fetched1 = await prisma.questionnaireResponse.findUnique({ where: { id: resp1.id } })
  const fetched2 = await prisma.questionnaireResponse.findUnique({ where: { id: resp2.id } })

  if (!fetched1 || !fetched2) throw new Error('One of the created responses was not found')

  const parsed1 = JSON.parse(fetched1.answers)
  const parsed2 = JSON.parse(fetched2.answers)

  // Basic assertions
  if (fetched1.status !== 'completed' || fetched2.status !== 'completed') throw new Error('Responses were not completed')
  if (parsed1.fullName !== resp1Answers.fullName) throw new Error('Response1 name mismatch')
  if (parsed2.fullName !== resp2Answers.fullName) throw new Error('Response2 name mismatch')

  console.log('✅ Clean integration assertions passed')

  // Cleanup after test
  await prisma.questionnaireResponse.deleteMany({ where: { id: { in: [resp1.id, resp2.id] } } })
  await prisma.question.deleteMany({ where: { viewGroupId: undefined } }).catch(() => {})
  await prisma.viewGroup.deleteMany({}).catch(() => {})
  await prisma.section.deleteMany({}).catch(() => {})
  await prisma.questionnaireVersion.deleteMany({}).catch(() => {})
  await prisma.questionnaire.deleteMany({}).catch(() => {})

  console.log('🧹 Cleaned up after test')
}

main()
  .then(() => { console.log('Test completed successfully'); process.exit(0) })
  .catch((e) => { console.error('Test failed:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
