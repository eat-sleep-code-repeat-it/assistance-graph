-- CreateTable
CREATE TABLE "questionnaires" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "version" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionnaireId" TEXT NOT NULL,
    CONSTRAINT "sections_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "questionnaires" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "view_groups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "viewId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "titleText" TEXT NOT NULL,
    "subTitleText" TEXT,
    "bodyText" TEXT,
    "sectionId" TEXT NOT NULL,
    CONSTRAINT "view_groups_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "keyName" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" TEXT,
    "order" INTEGER NOT NULL,
    "required" BOOLEAN NOT NULL,
    "yesText" TEXT,
    "noText" TEXT,
    "defaultValue" TEXT,
    "viewGroupId" TEXT NOT NULL,
    CONSTRAINT "questions_viewGroupId_fkey" FOREIGN KEY ("viewGroupId") REFERENCES "view_groups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "sections_questionnaireId_idx" ON "sections"("questionnaireId");

-- CreateIndex
CREATE INDEX "view_groups_sectionId_idx" ON "view_groups"("sectionId");

-- CreateIndex
CREATE INDEX "questions_viewGroupId_idx" ON "questions"("viewGroupId");
