-- CreateTable
CREATE TABLE "SponsorPackage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "monthlyFee" REAL NOT NULL,
    "setupFee" REAL NOT NULL DEFAULT 0,
    "campaignLimit" INTEGER NOT NULL DEFAULT 1,
    "qrLimit" INTEGER NOT NULL DEFAULT 5,
    "venuePlacementLimit" INTEGER NOT NULL DEFAULT 1,
    "reportingLevel" TEXT NOT NULL DEFAULT 'basic',
    "includedServices" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sponsorId" TEXT,
    "packageId" TEXT,
    "venueId" TEXT,
    "campaignType" TEXT NOT NULL DEFAULT 'qr',
    "termMonths" INTEGER NOT NULL DEFAULT 12,
    "customBudget" REAL,
    "estimatedROI" REAL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Proposal_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Proposal_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "SponsorPackage" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Proposal_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sponsorId" TEXT,
    "proposalId" TEXT,
    "invoiceNumber" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "dueDate" DATETIME,
    "paidAt" DATETIME,
    "paymentProvider" TEXT,
    "paymentRef" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Invoice_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Invoice_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SponsorPackage_slug_key" ON "SponsorPackage"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");
