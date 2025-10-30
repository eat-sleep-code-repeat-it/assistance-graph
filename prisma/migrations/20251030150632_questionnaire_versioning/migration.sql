/*
  Warnings:

  - You are about to drop the `questionnaireResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `version` on the `questionnaires` table. All the data in the column will be lost.
  - You are about to drop the column `questionnaireId` on the `sections` table. All the data in the column will be lost.
  - Added the required column `questionnaireVersionId` to the `sections` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "questionnaireResponse_questionnaireId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "questionnaireResponse";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "questionnaire_versions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionnaireId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "questionnaire_versions_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "questionnaires" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "questionnaire_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "versionId" TEXT NOT NULL,
    "respondentId" TEXT,
    "status" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "submittedAt" DATETIME,
    CONSTRAINT "questionnaire_responses_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "questionnaire_versions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_questionnaires" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "currentVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_questionnaires" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "questionnaires";
DROP TABLE "questionnaires";
ALTER TABLE "new_questionnaires" RENAME TO "questionnaires";
CREATE TABLE "new_sections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionnaireVersionId" TEXT NOT NULL,
    CONSTRAINT "sections_questionnaireVersionId_fkey" FOREIGN KEY ("questionnaireVersionId") REFERENCES "questionnaire_versions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_sections" ("id") SELECT "id" FROM "sections";
DROP TABLE "sections";
ALTER TABLE "new_sections" RENAME TO "sections";
CREATE INDEX "sections_questionnaireVersionId_idx" ON "sections"("questionnaireVersionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_versions_questionnaireId_version_key" ON "questionnaire_versions"("questionnaireId", "version");

-- CreateIndex
CREATE INDEX "questionnaire_responses_versionId_idx" ON "questionnaire_responses"("versionId");
