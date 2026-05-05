-- CreateTable
CREATE TABLE "SalesIntake" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "intakeId" TEXT NOT NULL,
    "registrationType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending-review',
    "businessLegalName" TEXT NOT NULL,
    "dbaName" TEXT,
    "einLastFour" TEXT,
    "businessAddress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "website" TEXT,
    "businessCategory" TEXT,
    "contactFirstName" TEXT NOT NULL,
    "contactLastName" TEXT NOT NULL,
    "contactTitle" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "packageId" TEXT,
    "packageName" TEXT,
    "salesTerritory" TEXT,
    "estimatedBudget" REAL,
    "interestedServices" TEXT,
    "notes" TEXT,
    "adminNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BusinessContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "intakeId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "title" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BusinessContact_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "SalesIntake" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SalesProposal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "intakeId" TEXT,
    "packageId" TEXT,
    "packageName" TEXT,
    "termMonths" INTEGER NOT NULL DEFAULT 12,
    "monthlyAmount" REAL,
    "setupAmount" REAL,
    "totalAmount" REAL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "notes" TEXT,
    "sentAt" DATETIME,
    "acceptedAt" DATETIME,
    "declinedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SalesProposal_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "SalesIntake" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminReviewEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "intakeId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "note" TEXT,
    "actorId" TEXT,
    "actorEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminReviewEvent_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "SalesIntake" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SalesIntake_intakeId_key" ON "SalesIntake"("intakeId");
