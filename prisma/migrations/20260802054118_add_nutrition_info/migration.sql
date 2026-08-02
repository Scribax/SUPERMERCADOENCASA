-- AlterTable
ALTER TABLE "Order" ADD COLUMN "locality" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "nutritionInfo" TEXT;

-- CreateTable
CREATE TABLE "Locality" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shippingCost" REAL NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Locality_name_key" ON "Locality"("name");
