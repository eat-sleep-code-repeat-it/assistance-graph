/*
  Warnings:

  - You are about to drop the `questionnaire_responses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "questionnaire_responses";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "questionnaireResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionnaireId" TEXT NOT NULL,
    "respondentId" TEXT,
    "status" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "submittedAt" DATETIME,
    CONSTRAINT "questionnaireResponse_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "questionnaires" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "questionnaireResponse_questionnaireId_idx" ON "questionnaireResponse"("questionnaireId");
