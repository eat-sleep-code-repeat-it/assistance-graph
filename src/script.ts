// 1
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create a questionnaire with an initial version, sections, view groups and questions
async function createQuestionnaire() {
    return await prisma.questionnaire.create({
        data: {
            // currentVersion defaults to 1, but we explicitly create the initial version
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
                                                viewId: 'intro',
                                                name: 'Introduction',
                                                titleText: 'Welcome',
                                                questions: {
                                                    create: [
                                                        {
                                                            name: 'consent',
                                                            keyName: 'userConsent',
                                                            text: 'Do you agree?',
                                                            type: 'YesNo',
                                                            order: 1,
                                                            required: true,
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        include: {
            versions: {
                include: { sections: { include: { viewGroups: { include: { questions: true } } } } },
            },
        },
    })
}

async function main() {
    // show existing questionnaires
    const before = await prisma.questionnaire.findMany({ include: { versions: true } })
    console.log('Before:', before)

    const created = await createQuestionnaire()
    console.log('Created:', created)

    const after = await prisma.questionnaire.findMany({ include: { versions: { include: { sections: { include: { viewGroups: { include: { questions: true } } } } } } } })
    console.log('After:', after)
}

main()
    .catch((e) => {
        console.error(e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })