-- CreateTable
CREATE TABLE "questionnaire_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionnaireId" TEXT NOT NULL,
    "respondentId" TEXT,
    "status" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "submittedAt" DATETIME,
    CONSTRAINT "questionnaire_responses_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "questionnaires" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "questionnaire_responses_questionnaireId_idx" ON "questionnaire_responses"("questionnaireId");
